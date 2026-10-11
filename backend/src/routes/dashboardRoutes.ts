
import express from "express";
import Bill from "../models/Bills";
import Expense from "../models/Expense";
import Maintenance from "../models/Maintenance";
import Appliance from "../models/Appliance";
import HomeService from "../models/HomeService";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [
      totalBills,
      pendingBills,
      totalExpenses,
      totalMaintenance,
      pendingMaintenance,
      totalAppliances,
      totalServices,
      pendingServices,
    ] = await Promise.all([
      Bill.countDocuments(),
      Bill.countDocuments({ status: "Pending" }),
      Expense.countDocuments(),
      Maintenance.countDocuments(),
      Maintenance.countDocuments({ status: "Pending" }),
      Appliance.countDocuments(),
      HomeService.countDocuments(),
      HomeService.countDocuments({
        status: { $in: ["Requested", "Accepted", "In Progress"] },
      }),
    ]);

    const expenseResult = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const maintenanceResult = await Maintenance.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$estimatedCost" },
        },
      },
    ]);

    res.json({
      message: "Dashboard data fetched successfully",
      bills: { total: totalBills, pending: pendingBills },
      expenses: {
        total: totalExpenses,
        amount: expenseResult[0]?.total || 0,
      },
      maintenance: {
        total: totalMaintenance,
        pending: pendingMaintenance,
        estimatedCost: maintenanceResult[0]?.total || 0,
      },
      appliances: { total: totalAppliances },
      homeServices: { total: totalServices, pending: pendingServices },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

export default router;
