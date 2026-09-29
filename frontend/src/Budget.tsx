import { useState } from "react";

function Budget() {
  const [budget, setBudget] = useState(10000);
  const [spent] = useState(6500);

  const remaining = budget - spent;

  const percentage =
    budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const updateBudget = () => {
    const newBudget = prompt("Enter your monthly budget");

    if (newBudget && Number(newBudget) > 0) {
      setBudget(Number(newBudget));
    }
  };

  return (
    <div className="finance-page">

      <div className="finance-header">
        <p className="section-label">HOME FINANCE</p>

        <h1>Monthly Budget</h1>

        <p>
          Monitor your spending and stay within your monthly budget.
        </p>
      </div>

      <div className="budget-main-card">

        <div className="budget-top">

          <div>
            <span>Monthly Budget</span>
            <h2>₹{budget}</h2>
          </div>

          <button
            className="primary-button"
            onClick={updateBudget}
          >
            Set Budget
          </button>

        </div>

        <div className="budget-progress">

          <div className="progress-label">
            <span>Amount Spent</span>
            <strong>₹{spent}</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="progress-label">
            <span>{Math.round(percentage)}% used</span>
            <span>₹{remaining} remaining</span>
          </div>

        </div>

      </div>

      <div className="budget-cards">

        <div className="budget-card">
          <span>Budget</span>
          <strong>₹{budget}</strong>
          <p>Your monthly limit</p>
        </div>

        <div className="budget-card">
          <span>Spent</span>
          <strong>₹{spent}</strong>
          <p>Total amount spent</p>
        </div>

        <div className="budget-card">
          <span>Remaining</span>
          <strong>₹{remaining}</strong>
          <p>Available balance</p>
        </div>

      </div>

      <div className="budget-status">

        {remaining >= 0 ? (
          <>
            <div className="status-icon">✓</div>

            <div>
              <h3>You're within your budget</h3>
              <p>
                You still have ₹{remaining} available this month.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="status-icon">!</div>

            <div>
              <h3>Budget exceeded</h3>
              <p>
                You have spent ₹{Math.abs(remaining)} over your budget.
              </p>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Budget;