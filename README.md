# ⚖️ ClauseVader – The Sith-Lord Contract Analyzer

ClauseVader is an AI-powered contract analysis tool where the intelligence of GPT-4 meets the might of the dark side. Upload your contracts, extract meaningful clauses, understand their implications, and chat with your very own Sith Lord legal assistant.

> “You may upload the agreement… but it does not favor you.” – ClauseVader

---

## 🚀 Features

- 📄 Upload `.pdf` or `.docx` contract files
- 🧠 Extracted clause insights using GPT-4
  - Clause summary
  - Pros & Cons
  - Risk score & favourability
- 📊 Graph-based clause scoring (x: favourability, y: risk)
- 💬 Real-time chat with ClauseVader (streamed GPT-4 responses)
- 🔐 User-authenticated document history and storage

---

## 🛠 Tech Stack

**Frontend** (Deployed on [Vercel](https://vercel.com))  
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- HTML, CSS, JavaScript  
- Connected to backend via REST API

**Backend** (Deployed on [Railway](https://railway.app))  
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/) ORM
- [PostgreSQL](https://neon.tech/) (NeonDB)
- [Uvicorn](https://www.uvicorn.org/) ASGI server
- GPT-4 via [OpenAI API](https://platform.openai.com/)

---

## 📦 Backend Setup (FastAPI)

1. **Install Dependencies**

```bash
cd backend
pip install -r requirements.txt
