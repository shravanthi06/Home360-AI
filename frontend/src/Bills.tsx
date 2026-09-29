import { useState } from "react";

type Bill = {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid";
};

function Bills() {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 1,
      name: "Electricity",
      amount: 1200,
      dueDate: "2026-09-10",
      status: "Pending",
    },
    {
      id: 2,
      name: "Internet",
      amount: 800,
      dueDate: "2026-09-05",
      status: "Paid",
    },
  ]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addBill = () => {
    if (!name || !amount || !dueDate) {
      alert("Please fill all fields");
      return;
    }

    const newBill: Bill = {
      id: Date.now(),
      name,
      amount: Number(amount),
      dueDate,
      status: "Pending",
    };

    setBills([...bills, newBill]);

    setName("");
    setAmount("");
    setDueDate("");
  };

  const markAsPaid = (id: number) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? { ...bill, status: "Paid" }
          : bill
      )
    );
  };

  const deleteBill = (id: number) => {
    setBills(
      bills.filter((bill) => bill.id !== id)
    );
  };

  const totalBills = bills.reduce(
    (total, bill) => total + bill.amount,
    0
  );

  const pendingBills = bills.filter(
    (bill) => bill.status === "Pending"
  ).length;

  const paidBills = bills.filter(
    (bill) => bill.status === "Paid"
  ).length;

  return (
    <div className="finance-page">

      <div className="finance-header">
        <p className="section-label">HOME FINANCE</p>

        <h1>Bills</h1>

        <p>
          Keep track of your household bills and payment status.
        </p>
      </div>

      <div className="bill-summary">

        <div className="bill-summary-card">
          <span>Total Bills</span>
          <strong>{bills.length}</strong>
        </div>

        <div className="bill-summary-card">
          <span>Pending</span>
          <strong>{pendingBills}</strong>
        </div>

        <div className="bill-summary-card">
          <span>Paid</span>
          <strong>{paidBills}</strong>
        </div>

        <div className="bill-summary-card">
          <span>Total Amount</span>
          <strong>₹{totalBills}</strong>
        </div>

      </div>

      <div className="bill-form-card">

        <h2>Add New Bill</h2>

        <div className="bill-form">

          <input
            type="text"
            placeholder="Bill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

        </div>

        <button
          className="primary-button"
          onClick={addBill}
        >
          Add Bill
        </button>

      </div>

      <div className="bill-list">

        <h2>Your Bills</h2>

        {bills.map((bill) => (
          <div className="bill-card" key={bill.id}>

            <div className="bill-icon">
              🧾
            </div>

            <div className="bill-info">

              <h3>{bill.name}</h3>

              <p>
                Due date: {bill.dueDate}
              </p>

            </div>

            <div className="bill-amount">
              ₹{bill.amount}
            </div>

            <span
              className={
                bill.status === "Paid"
                  ? "paid-status"
                  : "pending-status"
              }
            >
              {bill.status}
            </span>

            <div className="bill-actions">

              {bill.status === "Pending" && (
                <button
                  className="paid-button"
                  onClick={() => markAsPaid(bill.id)}
                >
                  Mark Paid
                </button>
              )}

              <button
                className="delete-button"
                onClick={() => deleteBill(bill.id)}
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

export default Bills;