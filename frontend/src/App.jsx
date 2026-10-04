
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

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
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          action: action,
        }),
      });

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error("Error:", error);

      setAnswer(
        "Something went wrong while connecting to the AI. Please try again."
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

