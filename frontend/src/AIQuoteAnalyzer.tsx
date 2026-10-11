
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/ai-quotes";

interface Quote {
  _id: string;
  serviceName: string;
  providerName: string;
  price: number;
  warrantyMonths: number;
  estimatedDays: number;
  rating: number;
  description?: string;
  status: "Pending" | "Selected" | "Rejected";
}

function AIQuoteAnalyzer() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [price, setPrice] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState("0");
  const [estimatedDays, setEstimatedDays] = useState("0");
  const [rating, setRating] = useState("0");
  const [description, setDescription] = useState("");
  const [compareService, setCompareService] = useState("");
  const [comparison, setComparison] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadQuotes() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load quotes");
      }

      setQuotes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to connect to backend"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  async function addQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: serviceName.trim(),
          providerName: providerName.trim(),
          price: Number(price),
          warrantyMonths: Number(warrantyMonths),
          estimatedDays: Number(estimatedDays),
          rating: Number(rating),
          description: description.trim(),
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add quote");
      }

      setServiceName("");
      setProviderName("");
      setPrice("");
      setWarrantyMonths("0");
      setEstimatedDays("0");
      setRating("0");
      setDescription("");
      setSuccess("Quote added successfully!");
      setComparison(null);

      await loadQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add quote");
    }
  }

  async function compareQuotes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setComparison(null);

    if (!compareService.trim()) {
      setError("Enter a service name to compare quotes.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/compare/${encodeURIComponent(compareService.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to compare quotes");
      }

      setComparison(data.quotes);
      setSuccess(
        `Found ${data.totalQuotes} quotes. Lowest price: ₹${data.lowestPrice}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to compare quotes");
    }
  }

  async function updateStatus(
    quote: Quote,
    status: Quote["status"]
  ) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${quote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quote");
      }

      setSuccess(`Quote marked as ${status}.`);
      setComparison(null);
      await loadQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update quote");
    }
  }

  async function deleteQuote(id: string) {
    if (!window.confirm("Are you sure you want to delete this quote?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete quote");
      }

      setSuccess("Quote deleted successfully.");
      setComparison(null);
      await loadQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete quote");
    }
  }

  const displayedQuotes = comparison ?? quotes;

  const lowestPrice =
    displayedQuotes.length > 0
      ? Math.min(...displayedQuotes.map((quote) => quote.price))
      : 0;

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "0",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#222222",
    fontSize: "14px",
    outlineColor: "#2563eb",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    margin: "5px 5px 5px 0",
    fontSize: "14px",
    fontWeight: 600,
  };

  const formStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "24px",
    background: "#ffffff",
    color: "#222222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    fontSize: "14px",
    color: "#334155",
    minWidth: 0,
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "24px",
        color: "#222222",
        background: "#f8fafc",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ color: "#0f172a", marginBottom: "8px" }}>
        AI Quote Analyzer
      </h1>

      <p style={{ color: "#64748b", marginTop: 0 }}>
        Compare home service quotations and choose the right provider.
      </p>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Total Quotes</p>
          <h2 style={summaryNumberStyle}>{quotes.length}</h2>
        </div>

        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Pending</p>
          <h2 style={summaryNumberStyle}>
            {quotes.filter((q) => q.status === "Pending").length}
          </h2>
        </div>

        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Selected</p>
          <h2 style={summaryNumberStyle}>
            {quotes.filter((q) => q.status === "Selected").length}
          </h2>
        </div>
      </div>

      {/* Add Quote Form */}
      <form onSubmit={addQuote} style={formStyle}>
        <h2 style={{ marginTop: 0, marginBottom: "22px" }}>
          Add Service Quote
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          <label style={labelStyle}>
            Service Name
            <input
              style={inputStyle}
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. AC Repair"
              required
            />
          </label>

          <label style={labelStyle}>
            Provider Name
            <input
              style={inputStyle}
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g. ABC Services"
              required
            />
          </label>

          <label style={labelStyle}>
            Price (₹)
            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
          </label>

          <label style={labelStyle}>
            Warranty (months)
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={warrantyMonths}
              onChange={(e) => setWarrantyMonths(e.target.value)}
            />
          </label>

          <label style={labelStyle}>
            Estimated Days
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
            />
          </label>

          <label style={labelStyle}>
            Provider Rating (0–5)
            <input
              style={inputStyle}
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </label>

          <label
            style={{
              ...labelStyle,
              gridColumn: "1 / -1",
            }}
          >
            Description
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work included in the quote"
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            ...buttonStyle,
            background: "#2563eb",
            color: "#ffffff",
            padding: "12px 22px",
            marginTop: "22px",
          }}
        >
          Add Quote
        </button>
      </form>

      {/* Compare Quotes Form */}
      <form onSubmit={compareQuotes} style={formStyle}>
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
          Compare Service Quotes
        </h2>

        <label style={labelStyle}>
          Service Name to Compare
          <input
            style={inputStyle}
            type="text"
            value={compareService}
            onChange={(e) => setCompareService(e.target.value)}
            placeholder="Enter a service, e.g. AC Repair"
            required
          />
        </label>

        <button
          type="submit"
          style={{
            ...buttonStyle,
            background: "#0f766e",
            color: "#ffffff",
            marginTop: "18px",
          }}
        >
          Compare Quotes
        </button>

        {comparison !== null && (
          <button
            type="button"
            onClick={() => {
              setComparison(null);
              setSuccess("");
              setError("");
            }}
            style={{
              ...buttonStyle,
              background: "#e2e8f0",
              color: "#222222",
            }}
          >
            Show All Quotes
          </button>
        )}
      </form>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {success}
        </div>
      )}

      {/* Quote List */}
      <h2 style={{ marginTop: "30px" }}>
        {comparison !== null ? "Comparison Results" : "All Service Quotes"}
      </h2>

      {loading ? (
        <p>Loading quotes...</p>
      ) : displayedQuotes.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          {comparison !== null
            ? "No quotes found for this service. Add quotes using the same service name, then compare again."
            : "No quotes found. Add a service quote to get started."}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "16px",
          }}
        >
          {displayedQuotes.map((quote) => (
            <div
              key={quote._id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                background: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#0f172a" }}>
                {quote.serviceName}
              </h3>

              <p>
                <strong>Provider:</strong> {quote.providerName}
              </p>

              <p style={{ fontSize: "22px", fontWeight: 700, color: "#0f766e" }}>
                ₹{quote.price.toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Warranty:</strong> {quote.warrantyMonths} months
              </p>

              <p>
                <strong>Estimated time:</strong> {quote.estimatedDays} days
              </p>

              <p>
                <strong>Rating:</strong> {quote.rating}/5
              </p>

              {quote.description && (
                <p>
                  <strong>Description:</strong> {quote.description}
                </p>
              )}

              <p>
                <strong>Status:</strong> {quote.status}
              </p>

              {quote.price === lowestPrice && (
                <p style={{ color: "#047857", fontWeight: 700 }}>
                  Lowest price {comparison !== null ? "in this comparison" : "in this list"}
                </p>
              )}

              <div style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => updateStatus(quote, "Selected")}
                  style={{
                    ...buttonStyle,
                    background: "#16a34a",
                    color: "#ffffff",
                  }}
                >
                  Select Quote
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(quote, "Rejected")}
                  style={{
                    ...buttonStyle,
                    background: "#fee2e2",
                    color: "#991b1b",
                  }}
                >
                  Reject Quote
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(quote, "Pending")}
                  style={{
                    ...buttonStyle,
                    background: "#e2e8f0",
                    color: "#222222",
                  }}
                >
                  Reset Status
                </button>

                <button
                  type="button"
                  onClick={() => deleteQuote(quote._id)}
                  style={{
                    ...buttonStyle,
                    background: "#dc2626",
                    color: "#ffffff",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const summaryCardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  padding: "18px",
  borderRadius: "10px",
  background: "#ffffff",
};

const summaryLabelStyle: React.CSSProperties = {
  color: "#64748b",
  margin: 0,
};

const summaryNumberStyle: React.CSSProperties = {
  color: "#0f172a",
  marginBottom: 0,
};

export default AIQuoteAnalyzer;
