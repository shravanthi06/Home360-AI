import { useState } from "react";

type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  notes: string;
};

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      category: "Electricity",
      amount: 1200,
      date: "2026-09-01",
      vendor: "TNEB",
      notes: "Monthly electricity bill",
    },
  ]);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const clearForm = () => {
    setCategory("");
    setAmount("");
    setDate("");
    setVendor("");
    setNotes("");
    setEditId(null);
  };

  const addExpense = () => {
    if (!category || !amount || !date || !vendor) {
      alert("Please fill all required fields");
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      category,
      amount: Number(amount),
      date,
      vendor,
      notes,
    };

    setExpenses([...expenses, newExpense]);
    clearForm();
  };

  const startEdit = (expense: Expense) => {
    setEditId(expense.id);
    setCategory(expense.category);
    setAmount(String(expense.amount));
    setDate(expense.date);
    setVendor(expense.vendor);
    setNotes(expense.notes);
  };

  const updateExpense = () => {
    if (!category || !amount || !date || !vendor) {
      alert("Please fill all required fields");
      return;
    }

    setExpenses(
      expenses.map((expense) =>
        expense.id === editId
          ? {
              ...expense,
              category,
              amount: Number(amount),
              date,
              vendor,
              notes,
            }
          : expense
      )
    );

    clearForm();
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="finance-page">

      <div className="finance-header">
        <p className="section-label">HOME FINANCE</p>

        <h1>Expenses</h1>

        <p>
          Track and manage all your home-related expenses.
        </p>
      </div>

      <div className="expense-summary">
        <div className="summary-card">
          <span>Total Expenses</span>
          <strong>₹{totalExpenses}</strong>
        </div>

        <div className="summary-card">
          <span>Transactions</span>
          <strong>{expenses.length}</strong>
        </div>
      </div>

      <div className="expense-form-card">

        <h2>
          {editId ? "Edit Expense" : "Add New Expense"}
        </h2>

        <div className="expense-form">

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

        </div>

        <div className="expense-form-buttons">

          {editId ? (
            <button
              className="primary-button"
              onClick={updateExpense}
            >
              Update Expense
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={addExpense}
            >
              Add Expense
            </button>
          )}

          {editId && (
            <button
              className="secondary-button"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      <div className="expense-list">

        <h2>Recent Expenses</h2>

        {expenses.map((expense) => (
          <div className="expense-card" key={expense.id}>

            <div className="expense-icon">
              💰
            </div>

            <div className="expense-info">
              <h3>{expense.category}</h3>

              <p>
                {expense.vendor} • {expense.date}
              </p>

              {expense.notes && (
                <small>{expense.notes}</small>
              )}
            </div>

            <div className="expense-amount">
              ₹{expense.amount}
            </div>

            <div className="expense-actions">

              <button
                className="edit-button"
                onClick={() => startEdit(expense)}
              >
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => deleteExpense(expense.id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Expenses;