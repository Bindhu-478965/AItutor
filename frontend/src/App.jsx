
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const BACKEND_URL = "https://aitutor-2mas.onrender.com";

function App() {
  const [input, setInput] = useState("");
  const [action, setAction] = useState("Explain");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          action: action,
        }),
      });

      console.log("Backend status:", response.status);

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        setAnswer(
          `Backend error (${response.status}): ${
            data.detail || "Something went wrong on the server."
          }`
        );
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("Connection error:", error);

      setAnswer(
        "Could not connect to the backend. Please check whether the Render server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Code Helper</h1>
        <p>Understand, generate, and fix code with AI</p>
      </header>

      <main className="container">
        <section className="input-section">
          <label htmlFor="code-input">
            Ask a question or paste your code
          </label>

          <textarea
            id="code-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Example: Explain this Python code..."
          />

          <div className="controls">
            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              disabled={loading}
            >
              <option value="Explain">Explain Code</option>
              <option value="Generate">Generate Code</option>
              <option value="Fix">Fix Code</option>
              <option value="Improve">Improve Code</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </section>

        <section className="result-section">
          <div className="result-header">
            <h2>Result</h2>

            <button
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(answer)}
              disabled={!answer || loading}
            >
              Copy
            </button>
          </div>

          <div className="result-box">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Generating your answer...</p>
                <span>Please wait while the AI processes your request.</span>
              </div>
            ) : answer ? (
              <ReactMarkdown>{answer}</ReactMarkdown>
            ) : (
              <p className="placeholder">
                Your AI response will appear here.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

