from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
import os
import shutil

from db import SessionLocal
from models import User, Document, Clause, Chat, DocumentStatusEnum
from utils.extract_text import extract_text_from_file
from utils.clause_scoring import analyze_clauses
from utils.chat_assistant import ask_assistant

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    role: str = Form(...),
    user_id: str = Form(...)
):
    db = SessionLocal()

    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF or DOCX allowed.")

    doc_id = str(uuid4())
    save_path = os.path.join(UPLOAD_FOLDER, f"{doc_id}_{file.filename}")

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_file(file)

    new_doc = Document(
        id=doc_id,
        user_id=user_id,
        filename=file.filename,
        extracted_text=extracted_text,
        role=role,
        status=DocumentStatusEnum.processing
    )
    db.add(new_doc)
    db.commit()

    # Analyze document using OpenAI
    analysis = analyze_clauses(extracted_text, role)

    # Save clauses to DB
    for clause in analysis['clause_graph']:
        new_clause = Clause(
            id=clause['id'],
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

    return {"document_id": doc_id, "status": "processing"}


@app.get("/api/documents/{doc_id}/status")
def check_status(doc_id: str):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": doc.status}


@app.get("/api/documents/{doc_id}/analysis")
def get_analysis(doc_id: str):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc or doc.status != DocumentStatusEnum.done:
        raise HTTPException(status_code=404, detail="Analysis not ready")

    clauses = db.query(Clause).filter(Clause.document_id == doc_id).all()
    clause_graph = [
        {
            "id": clause.id,
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

    doc_id = data.get("document_id")
    message = data.get("message", "")
    user_id = data.get("user_id", "anonymous")

    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    reply = ask_assistant(message, doc.extracted_text, user_id)

    chat = Chat(
        user_id=user_id,
        document_id=doc_id,
        user_message=message,
        ai_response=reply
    )
    db.add(chat)
    db.commit()

    return {"reply": reply}
