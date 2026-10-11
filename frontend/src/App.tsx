
import { useEffect, useState } from "react";
import "./App.css";
import "./theme.css";
import HomeImageGallery from "./HomeGallery";
import Appliances from "./Appliances";
import AIQuoteAnalyzer from "./AIQuoteAnalyzer";
import AIHomeAssistant from "./AIHomeAssistant";
import Bills from "./Bills";
import Budget from "./Budget";
import Expenses from "./Expenses";
import HomePassport from "./HomePassport";
import HomeServices from "./HomeServices";
import Maintenance from "./Maintenance";
import Notifications from "./Notifications";
import SmartSchedule from "./SmartSchedule";

type Page =
  | "Dashboard"
  | "AI Quote Analyzer"
  | "AI Home Assistant"
  | "Appliances"
  | "Bills"
  | "Budget"
  | "Expenses"
  | "Home Passport"
  | "Home Services"
  | "Maintenance"
  | "Notifications"
  | "Smart Schedule";

interface DashboardData {
  bills: { total: number; pending: number };
  expenses: { total: number; amount: number };
  maintenance: {
    total: number;
    pending: number;
    estimatedCost: number;
  };
  appliances: { total: number };
  homeServices: { total: number; pending: number };
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("Dashboard");
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [dashboardError, setDashboardError] = useState("");
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const menuItems: Page[] = [
    "Dashboard",
    "AI Quote Analyzer",
    "AI Home Assistant",
    "Appliances",
    "Bills",
    "Budget",
    "Expenses",
    "Home Passport",
    "Home Services",
    "Maintenance",
    "Notifications",
    "Smart Schedule",
  ];

  const moduleIcons: Record<Page, string> = {
    Dashboard: "🏠",
    "AI Quote Analyzer": "🤖",
    "AI Home Assistant": "✨",
    Appliances: "🧊",
    Bills: "🧾",
    Budget: "💰",
    Expenses: "💳",
    "Home Passport": "🏡",
    "Home Services": "🛠️",
    Maintenance: "🔧",
    Notifications: "🔔",
    "Smart Schedule": "📅",
  };

  async function loadDashboard() {
    setLoadingDashboard(true);
    setDashboardError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      if (!response.ok) {
        throw new Error("Could not load dashboard");
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard error:", error);
      setDashboardError(
        "Unable to load dashboard data. Please make sure the backend is running."
      );
    } finally {
      setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  function renderDashboard() {
    return (
      <div className="dashboard">
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <p className="welcome-label">
              YOUR SMART HOME, SIMPLIFIED
            </p>

            <h2>Welcome to HOME360 AI!</h2>

            <p>
              Manage your home, track expenses, organize
              maintenance, and schedule home services — all
              in one convenient place.
            </p>

            <button
              className="welcome-button"
              onClick={() => setCurrentPage("Home Services")}
            >
              Explore Home Services →
            </button>

            <div className="welcome-features">
              <span>✓ Easy Management</span>
              <span>✓ Smart Planning</span>
            </div>
          </div>

          <div className="welcome-image">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
              alt="Beautiful modern living room"
            />

            <div className="image-caption">
              <span>🏡</span>
              <div>
                <strong>Your Home, Your Control</strong>
                <p>Everything managed in one place</p>
              </div>
            </div>
          </div>
        </section>

        {/* New home photography gallery */}
        <HomeImageGallery />

        <section className="dashboard-stats">
          <div className="modules-heading">
            <div>
              <p className="section-label">LIVE HOME OVERVIEW</p>
              <h2>Your Dashboard</h2>
              <p>Summary from your HOME360 AI backend.</p>
            </div>

            <button className="back-button" onClick={loadDashboard}>
              ↻ Refresh
            </button>
          </div>

          {loadingDashboard && (
            <p>Loading your home information...</p>
          )}

          {dashboardError && (
            <p role="alert">{dashboardError}</p>
          )}

          {dashboardData && !loadingDashboard && (
            <div className="dashboard-grid">
              <div className="module-card">
                <span className="module-icon">🧾</span>
                <h3>Total Bills</h3>
                <p>{dashboardData.bills.total} bills recorded</p>
                <span className="module-link">
                  {dashboardData.bills.pending} pending
                </span>
              </div>

              <div className="module-card">
                <span className="module-icon">💳</span>
                <h3>Expenses</h3>
                <p>{dashboardData.expenses.total} records</p>
                <span className="module-link">
                  ₹{dashboardData.expenses.amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="module-card">
                <span className="module-icon">🔧</span>
                <h3>Maintenance</h3>
                <p>{dashboardData.maintenance.total} tasks</p>
                <span className="module-link">
                  {dashboardData.maintenance.pending} pending
                </span>
              </div>

              <div className="module-card">
                <span className="module-icon">🧊</span>
                <h3>Appliances</h3>
                <p>
                  {dashboardData.appliances.total} appliances recorded
                </p>
                <span className="module-link">Home assets</span>
              </div>

              <div className="module-card">
                <span className="module-icon">🛠️</span>
                <h3>Home Services</h3>
                <p>{dashboardData.homeServices.total} requests</p>
                <span className="module-link">
                  {dashboardData.homeServices.pending} active or pending
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="modules-section">
          <div className="modules-heading">
            <div>
              <p className="section-label">YOUR HOME AT A GLANCE</p>
              <h2>Home Management Modules</h2>
              <p>
                Choose a module to manage your home efficiently.
              </p>
            </div>

            <span className="module-count">
              {menuItems.length - 1} Modules
            </span>
          </div>

          <div className="dashboard-grid">
            {menuItems
              .filter((item) => item !== "Dashboard")
              .map((item) => (
                <button
                  className="module-card"
                  key={item}
                  onClick={() => setCurrentPage(item)}
                >
                  <span className="module-icon">
                    {moduleIcons[item]}
                  </span>

                  <h3>{item}</h3>

                  <p>
                    {item === "AI Quote Analyzer" &&
                      "Compare home service quotes and prices"}

                    {item === "AI Home Assistant" &&
                      "Get guidance for home maintenance and management"}

                    {item === "Appliances" &&
                      "Manage your home appliances"}

                    {item === "Bills" &&
                      "Track and manage your bills"}

                    {item === "Budget" &&
                      "Plan your monthly budget"}

                    {item === "Expenses" &&
                      "Monitor your home spending"}

                    {item === "Home Passport" &&
                      "Keep your home information organized"}

                    {item === "Home Services" &&
                      "Manage your service requests"}

                    {item === "Maintenance" &&
                      "Organize repairs and maintenance"}

                    {item === "Notifications" &&
                      "View important home reminders"}

                    {item === "Smart Schedule" &&
                      "Plan upcoming home activities"}
                  </p>

                  <span className="module-link">
                    Open Module →
                  </span>
                </button>
              ))}
          </div>
        </section>

        <section className="dashboard-tip">
          <span className="tip-icon">✨</span>
          <div>
            <h3>Make home management simpler</h3>
            <p>
              Track bills, plan expenses, compare service quotes,
              and schedule maintenance in one place.
            </p>
          </div>
        </section>
      </div>
    );
  }

  function renderPage() {
    switch (currentPage) {
      case "AI Quote Analyzer":
        return <AIQuoteAnalyzer />;

      case "AI Home Assistant":
        return <AIHomeAssistant />;

      case "Appliances":
        return <Appliances />;

      case "Bills":
        return <Bills />;

      case "Budget":
        return <Budget />;

      case "Expenses":
        return <Expenses />;

      case "Home Passport":
        return <HomePassport />;

      case "Home Services":
        return <HomeServices />;

      case "Maintenance":
        return <Maintenance />;

      case "Notifications":
        return <Notifications />;

      case "Smart Schedule":
        return <SmartSchedule />;

      default:
        return renderDashboard();
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">🏡</span>
          <div>
            <h1>HOME360 AI</h1>
            <p>
              Smart Home Management &amp; Maintenance Platform
            </p>
          </div>
        </div>
      </header>

      <nav className="app-navigation">
        {menuItems.map((item) => (
          <button
            key={item}
            className={
              currentPage === item ? "active-menu" : "menu-button"
            }
            onClick={() => setCurrentPage(item)}
          >
            <span>{moduleIcons[item]}</span> {item}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {currentPage !== "Dashboard" && (
          <div className="page-heading">
            <div>
              <p className="section-label">HOME360 AI WORKSPACE</p>
              <h2>
                {moduleIcons[currentPage]} {currentPage}
              </h2>
            </div>

            <button
              className="back-button"
              onClick={() => setCurrentPage("Dashboard")}
            >
              ← Dashboard
            </button>
          </div>
        )}

        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>🏡 HOME360 AI | Smart Living, Simplified</p>
        <p>Designed to make every home easier to manage.</p>
      </footer>
    </div>
  );
}

export default App;
