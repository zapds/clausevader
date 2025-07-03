from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from uuid import uuid4, UUID
import os
import shutil
import openai

from db import SessionLocal
from models import User, Document, Clause, Chat, DocumentStatusEnum
from utils.extract_text import extract_text_from_file
from utils.clause_scoring import analyze_clauses
from utils.chat_assistant import ask_assistant  # <-- updated for streaming


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    role: str = Form(...),
    user_id: int = Form(...)
):
    db = SessionLocal()

    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF or DOCX allowed.")

    doc_id = uuid4()
    # save_path = os.path.join(UPLOAD_FOLDER, f"{doc_id}_{file.filename}")

    # with open(save_path, "wb") as buffer:
    #     shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_file(file)

    new_doc = Document(
        id=doc_id,
        user_id=user_id,
        filename=file.filename,
        # original_file_url=save_path,
        extracted_text=extracted_text,
        role=role,
        status=DocumentStatusEnum.processing
    )
    db.add(new_doc)
    db.commit()

    # Analyze document
    analysis = analyze_clauses(extracted_text, role)
    if "error" in analysis and analysis["error"] == True:
        return analysis

    # Save clauses to DB
    for clause in analysis['clause_graph']:
        new_clause = Clause(
            id=UUID(clause['id']) if isinstance(clause['id'], str) else clause['id'],
            document_id=doc_id,
            clause_text=clause['summary'],
            summary=clause['summary'],
            x=clause['x'],
            y=clause['y'],
            impact=clause['impact']
        )
        db.add(new_clause)

    new_doc.favourability_score = analysis['favourability_score']
    new_doc.status = DocumentStatusEnum.done
    db.commit()

    return {"document_id": str(doc_id), "status": "processing"}


@app.get("/api/documents/{doc_id}/status")
def check_status(doc_id: UUID):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": doc.status}


@app.get("/api/documents/{doc_id}/analysis")
def get_analysis(doc_id: UUID):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc or doc.status != DocumentStatusEnum.done:
        raise HTTPException(status_code=404, detail="Analysis not ready")

    clauses = db.query(Clause).filter(Clause.document_id == doc_id).all()
    clause_graph = [
        {
            "id": str(clause.id),
            "x": clause.x,
            "y": clause.y,
            "summary": clause.summary,
            "impact": clause.impact
        }
        for clause in clauses
    ]

    return {
        "favourability_score": doc.favourability_score,
        "clause_graph": clause_graph,
        "meta": {"title": doc.filename, "uploaded_by": doc.user_id}
    }


@app.post("/api/chat")
async def chat_with_doc(request: Request):
    db = SessionLocal()
    data = await request.json()

    doc_id = UUID(data.get("document_id"))
    message = data.get("message", "")
    user_id = int(data.get("user_id"))

    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    async def event_stream():
        full_reply = ""
        try:
            async for token in ask_assistant(message, doc.extracted_text, user_id):
                full_reply += token
                yield f"data: {token}\n\n"
        except Exception as e:
            yield f"data: [Error] {str(e)}\n\n"
        finally:
            chat = Chat(
                user_id=user_id,
                document_id=doc_id,
                user_message=message,
                ai_response=full_reply
            )
            db.add(chat)
            db.commit()

    return StreamingResponse(event_stream(), media_type="text/event-stream")
