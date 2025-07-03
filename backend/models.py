from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Text, Integer, Float, ForeignKey, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

Base = declarative_base()

class DocumentStatusEnum(str, enum.Enum):
    processing = "processing"
    done = "done"
    error = "error"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True)
    name = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Document(Base):
    __tablename__ = "documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String)
    filename = Column(String)
    extracted_text = Column(Text)
    role = Column(String)
    status = Column(Enum(DocumentStatusEnum), default=DocumentStatusEnum.processing)
    favourability_score = Column(Integer)
    title = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Clause(Base):
    __tablename__ = "clauses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    clause_text = Column(Text)
    summary = Column(Text)
    x = Column(Float)
    y = Column(Float)
    impact = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Chat(Base):
    __tablename__ = "chats"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    user_message = Column(Text)
    ai_response = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
