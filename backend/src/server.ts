
import dotenv from "dotenv";

// Load environment variables before importing routes
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import BillsRoutes from "./routes/BillsRoutes";
import BudgetRoutes from "./routes/BudgetRoutes";
import ExpenseRoutes from "./routes/expenseRoutes";
import homeServiceRoutes from "./routes/HomeServiceRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";
import applianceRoutes from "./routes/applianceRoutes";
import homePassportRoutes from "./routes/homePassportRoutes";
import smartScheduleRoutes from "./routes/smartScheduleRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import aiQuoteRoutes from "./routes/aiQuoteRoutes";
import aiAdvisorRoutes from "./routes/aiAdvisorRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("HOME360 AI Backend is running!");
});

app.use("/api/bills", BillsRoutes);
app.use("/api/budgets", BudgetRoutes);
app.use("/api/expenses", ExpenseRoutes);
app.use("/api/home-services", homeServiceRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/home-passport", homePassportRoutes);
app.use("/api/smart-schedule", smartScheduleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai-quotes", aiQuoteRoutes);
app.use("/api/ai-advisor", aiAdvisorRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(5000, () => {
      console.log("Backend running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });
