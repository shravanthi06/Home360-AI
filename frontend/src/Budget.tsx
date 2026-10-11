
import { useEffect, useState, type FormEvent } from "react";

const API = "http://localhost:5000/api/budgets";

interface BudgetItem {
  _id: string;
  month: string;
  year: number;
  totalBudget: number;
  notes?: string;
}

function Budget() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [month, setMonth] = useState("October");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [totalBudget, setTotalBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadBudgets() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Failed to load budgets");

      const data = await response.json();
      setBudgets(data);
      setError("");
    } catch {
      setError("Unable to load budgets. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function addBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          year: Number(year),
          totalBudget: Number(totalBudget),
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save budget");
      }

      setTotalBudget("");
      setNotes("");
      await loadBudgets();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save budget"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteBudget(id: string) {
    if (!window.confirm("Delete this budget?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      await loadBudgets();
    } catch {
      setError("Unable to delete budget.");
    }
  }

  const total = budgets.reduce(
    (sum, item) => sum + Number(item.totalBudget || 0),
    0
  );

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 20 }}>
      <h2>💰 Monthly Budget Management</h2>
      <p>Create and track your home budget.</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          margin: "20px 0",
        }}
      >
        <h3>Total Planned Budgets</h3>
        <h2>₹{total.toLocaleString("en-IN")}</h2>
        <p>{budgets.length} budget records</p>
      </div>

      <form
        onSubmit={addBudget}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <h3 style={{ gridColumn: "1 / -1" }}>Add Monthly Budget</h3>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December",
          ].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="number"
          min="2000"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          placeholder="Year"
        />

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          required
          placeholder="Budget amount (₹)"
        />

        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Budget"}
        </button>
      </form>

      <h3>Saved Budgets</h3>

      {loading ? (
        <p>Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <p>No budgets saved yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cellStyle}>Month</th>
                <th style={cellStyle}>Year</th>
                <th style={cellStyle}>Budget</th>
                <th style={cellStyle}>Notes</th>
                <th style={cellStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((item) => (
                <tr key={item._id}>
                  <td style={cellStyle}>{item.month}</td>
                  <td style={cellStyle}>{item.year}</td>
                  <td style={cellStyle}>
                    ₹{Number(item.totalBudget).toLocaleString("en-IN")}
                  </td>
                  <td style={cellStyle}>{item.notes || "—"}</td>
                  <td style={cellStyle}>
                    <button onClick={() => deleteBudget(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cellStyle = {
  padding: 10,
  textAlign: "left" as const,
  borderBottom: "1px solid #ddd",
};

export default Budget;
