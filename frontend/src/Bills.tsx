
import { useEffect, useState, type FormEvent } from "react";

const API = "http://localhost:5000/api/bills";

interface Bill {
  _id: string;
  title: string;
  category: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending";
  notes?: string;
}

const emptyForm = {
  title: "",
  category: "Utilities",
  amount: "",
  dueDate: "",
  status: "Pending" as "Paid" | "Pending",
  notes: "",
};

function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadBills() {
    try {
      setError("");
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to fetch bills");
      }

      const data = await response.json();
      setBills(data);
    } catch {
      setError("Cannot load bills. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, []);

  async function addBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save bill");
      }

      setForm(emptyForm);
      await loadBills();
    } catch {
      setError("Could not save the bill. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function updateBill(bill: Bill) {
    try {
      setError("");

      const response = await fetch(`${API}/${bill._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: bill.status === "Paid" ? "Pending" : "Paid",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update bill");
      }

      await loadBills();
    } catch {
      setError("Could not update bill status.");
    }
  }

  async function deleteBill(id: string) {
    if (!window.confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      setError("");
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete bill");
      }

      await loadBills();
    } catch {
      setError("Could not delete bill.");
    }
  }

  const totalAmount = bills.reduce(
    (total, bill) => total + Number(bill.amount || 0),
    0
  );

  const pendingAmount = bills
    .filter((bill) => bill.status === "Pending")
    .reduce((total, bill) => total + Number(bill.amount || 0), 0);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <h2>🧾 Bills Management</h2>
      <p>Manage your home bills using live backend data.</p>

      {error && (
        <p style={{ color: "crimson" }} role="alert">
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          margin: "20px 0",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Bills</h3>
          <p>{bills.length}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Amount</h3>
          <p>₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Amount</h3>
          <p>₹{pendingAmount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <form
        onSubmit={addBill}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <h3 style={{ gridColumn: "1 / -1" }}>Add New Bill</h3>

        <input
          placeholder="Bill title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option>Utilities</option>
          <option>Electricity</option>
          <option>Water</option>
          <option>Internet</option>
          <option>Maintenance</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          required
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
          required
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as "Paid" | "Pending",
            })
          }
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <input
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Add Bill"}
        </button>
      </form>

      <h3>Saved Bills</h3>

      {loading ? (
        <p>Loading bills...</p>
      ) : bills.length === 0 ? (
        <p>No bills found. Add your first bill above.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                {["Title", "Category", "Amount", "Due Date", "Status", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      style={{ padding: 10, borderBottom: "1px solid #ddd" }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td style={cellStyle}>{bill.title}</td>
                  <td style={cellStyle}>{bill.category}</td>
                  <td style={cellStyle}>
                    ₹{Number(bill.amount).toLocaleString("en-IN")}
                  </td>
                  <td style={cellStyle}>
                    {bill.dueDate
                      ? new Date(bill.dueDate).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td style={cellStyle}>{bill.status}</td>
                  <td style={cellStyle}>
                    <button onClick={() => updateBill(bill)}>
                      Mark {bill.status === "Paid" ? "Pending" : "Paid"}
                    </button>{" "}
                    <button onClick={() => deleteBill(bill._id)}>
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

const cardStyle = {
  flex: "1 1 180px",
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 12,
};

const cellStyle = {
  padding: 10,
  borderBottom: "1px solid #ddd",
};

export default Bills;
