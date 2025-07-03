from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import uuid
import os


def analyze_clauses(text, role="unsure"):
    prompt = f"""
You are a contract analysis AI. Extract key clauses from this contract.
For each clause, return:
- id: unique id
- summary: one-line explanation
- x: 0 (user-favourable) to 1 (issuer-favourable)
- y: 0 (neutral/low risk) to 1 (high risk)
- impact: 'favourable', 'neutral', 'unfavourable'

Text:
{text[:4000]}

Return JSON list. No commentary.
    """

    response = client.chat.completions.create(model="gpt-4",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.4)

    try:
        result = eval(response.choices[0].message.content)
    except SyntaxError:
        return {
            "error": True,
            "message": response.choices[0].message.content
        }
    for clause in result:
        clause["id"] = clause.get("id", str(uuid.uuid4()))

    score = int(sum([(1 - clause["x"]) for clause in result]) / len(result) * 100)

    return {
        "favourability_score": score,
        "clause_graph": result
    }
