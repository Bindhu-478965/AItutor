from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    input: str
    action: str


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@app.get("/")
def home():
    return {
        "message": "Code Helper API is running!"
    }


@app.post("/generate")
def generate(request: GenerateRequest):

    prompt = f"""
You are a helpful programming tutor.

The user wants you to: {request.action}

Here is the user's question or code:

{request.input}

Your job is to help the user understand programming.

If they ask you to explain code:
- Explain it clearly for a beginner.
- Explain important lines step by step.
- Explain unfamiliar programming concepts.
- Give a simple example when useful.

If they ask you to generate code:
- Give clean, working code.
- Explain the important parts.

If they ask you to fix code:
- Identify the problem.
- Give the corrected code.
- Explain what was wrong.

If they ask you to improve code:
- Give an improved version.
- Explain what you changed and why.

Always use Markdown code blocks when showing code.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                automatic_function_calling=types.AutomaticFunctionCallingConfig(
                    disable=True
                )
            )
        )

        return {
            "answer": response.text
        }

    except Exception as error:
        print("Gemini error:", error)

        return {
            "answer": "Gemini is temporarily busy right now. Please try again in a moment."
        }