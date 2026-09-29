import { useState } from "react";
import HomeServices from "./HomeServices";
import Expenses from "./Expenses";
import Bills from "./Bills";
import Budget from "./Budget";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const goHome = () => {
    setPage("home");
  };

  return (
    <div className="app">

      {page === "home" && (
        <div className="dashboard">

          <div className="hero">
            <p className="small-title">WELCOME TO</p>

            <h1>HOME360-AI</h1>

            <p className="subtitle">
              Smart management for your entire home
            </p>
          </div>

          <div className="module-container">

            <div
              className="module-card"
              onClick={() => setPage("services")}
            >
              <div className="icon">🛠️</div>
              <h2>Home Services</h2>
              <p>Find and request trusted service providers.</p>
            </div>

            <div
              className="module-card"
              onClick={() => setPage("expenses")}
            >
              <div className="icon">💰</div>
              <h2>Expenses</h2>
              <p>Manage and track your home expenses.</p>
            </div>

            <div
              className="module-card"
              onClick={() => setPage("bills")}
            >
              <div className="icon">🧾</div>
              <h2>Bills</h2>
              <p>Track electricity, water, internet and other bills.</p>
            </div>

            <div
              className="module-card"
              onClick={() => setPage("budget")}
            >
              <div className="icon">📊</div>
              <h2>Budget</h2>
              <p>Monitor your monthly budget and spending.</p>
            </div>

          </div>

          <p className="footer-text">
            Manage your home. Track your money. Simplify your life.
          </p>

        </div>
      )}

      {page !== "home" && (
        <div className="module-page">

          <button className="back-button" onClick={goHome}>
            ← Back to Home
          </button>

          {page === "services" && <HomeServices />}
          {page === "expenses" && <Expenses />}
          {page === "bills" && <Bills />}
          {page === "budget" && <Budget />}

        </div>
      )}

    </div>
  );
}

export default App;