import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_assistant(question, document_text, user_id):
    prompt = f"""
You are a contract assistant AI. Based on this contract, answer the user's question.

Document (truncated):
{document_text[:3000]}

Question:
{question}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    return response['choices'][0]['message']['content'].strip()
