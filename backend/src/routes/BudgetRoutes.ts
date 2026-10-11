
import { Router } from "express";
import Budget from "../models/Budget";

const router = Router();

// GET: Fetch all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ year: -1, month: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});

// GET: Fetch a budget by ID
router.get("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: "Invalid budget ID" });
  }
});

// POST: Add a budget
router.post("/", async (req, res) => {
  try {
    const { month, year, totalBudget, notes } = req.body;

    const budget = await Budget.create({
      month,
      year,
      totalBudget,
      notes,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add budget. Check required fields and duplicate month/year.",
    });
  }
});

// PUT: Update a budget
router.put("/:id", async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: "Failed to update budget" });
  }
});

// DELETE: Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete budget" });
  }
});

export default router;
