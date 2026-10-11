
import { useState } from "react";

function AIHomeAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    if (!question.trim()) {
      setAnswer("Please enter your home-related question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai-advisor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get advice.");
      }

      setAnswer(
        data.answer ||
          data.advice ||
          data.message ||
          JSON.stringify(data)
      );
    } catch (error) {
      console.error("AI Assistant error:", error);
      setAnswer(
        "Unable to get advice right now. Please check your backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format Gemini's response into readable text and bullet points
  const formatAnswer = (text: string) => {
    const cleanedText = text
      .replace(/\r\n/g, "\n")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "$1")
      .trim();

    // Split bullets even when Gemini returns everything on one line
    const formattedText = cleanedText
      .replace(/\s+(\*|-|•)\s+(?=\*\*|[A-Z])/g, "\n$1 ")
      .replace(/\s+(?=\d+\.\s)/g, "\n");

    return formattedText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "24px",
        color: "#222",
      }}
    >
      <h2>AI Home Assistant</h2>

      <p>
        Ask questions about home maintenance and household management.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            askAssistant();
          }
        }}
        placeholder="Example: How can I reduce my electricity bill?"
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "15px",
          resize: "vertical",
        }}
      />

      <button
        onClick={askAssistant}
        disabled={loading}
        style={{
          marginTop: "12px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          background: loading ? "#999" : "#2563eb",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Getting Advice..." : "Ask Assistant"}
      </button>

      {answer && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fafafa",
            lineHeight: 1.7,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
            Assistant Response
          </h3>

          {formatAnswer(answer).map((line, index) => {
            const isBullet = /^(\*|-|•)\s/.test(line);
            const content = line.replace(/^(\*|-|•)\s/, "");

            return isBullet ? (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span>•</span>
                <span>{content}</span>
              </div>
            ) : (
              <p key={index} style={{ margin: "8px 0" }}>
                {line}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AIHomeAssistant;
