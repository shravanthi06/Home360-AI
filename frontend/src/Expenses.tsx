
import { useEffect, useState, type FormEvent } from "react";

const API = "http://localhost:5000/api/expenses";

interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod?: string;
  notes?: string;
}

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Failed to load expenses");

      const data = await response.json();
      setExpenses(data);
      setError("");
    } catch {
      setError("Unable to load expenses. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          amount: Number(amount),
          date,
          paymentMethod,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save expense");
      }

      setTitle("");
      setAmount("");
      setNotes("");
      await loadExpenses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save expense"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteExpense(id: string) {
    if (!window.confirm("Delete this expense?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      await loadExpenses();
    } catch {
      setError("Unable to delete expense.");
    }
  }

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <h2>💳 Expense Management</h2>
      <p>Record and track your home spending.</p>

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      <div
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          margin: "20px 0",
        }}
      >
        <h3>Total Expenses</h3>
        <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
        <p>{expenses.length} expense records</p>
      </div>

      <form
        onSubmit={addExpense}
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
        <h3 style={{ gridColumn: "1 / -1" }}>Add Expense</h3>

        <input
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Groceries</option>
          <option>Electricity</option>
          <option>Water</option>
          <option>Internet</option>
          <option>Repairs</option>
          <option>Cleaning</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>UPI</option>
          <option>Cash</option>
          <option>Card</option>
          <option>Bank Transfer</option>
          <option>Other</option>
        </select>

        <input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Expense"}
        </button>
      </form>

      <h3>Saved Expenses</h3>

      {loading ? (
        <p>Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Title", "Category", "Amount", "Date", "Payment", "Action"].map(
                  (heading) => (
                    <th key={heading} style={cellStyle}>
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td style={cellStyle}>{expense.title}</td>
                  <td style={cellStyle}>{expense.category}</td>
                  <td style={cellStyle}>
                    ₹{Number(expense.amount).toLocaleString("en-IN")}
                  </td>
                  <td style={cellStyle}>
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td style={cellStyle}>
                    {expense.paymentMethod || "—"}
                  </td>
                  <td style={cellStyle}>
                    <button onClick={() => deleteExpense(expense._id)}>
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

export default Expenses;
