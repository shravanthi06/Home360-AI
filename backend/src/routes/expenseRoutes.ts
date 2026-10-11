
import { Router } from "express";
import Expense from "../models/Expense";

const router = Router();

// GET: Fetch all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// GET: Fetch one expense
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: "Invalid expense ID" });
  }
});

// POST: Add an expense
router.post("/", async (req, res) => {
  try {
    const { title, category, amount, date, paymentMethod, notes } = req.body;

    const expense = await Expense.create({
      title,
      category,
      amount,
      date,
      paymentMethod,
      notes,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: "Failed to add expense" });
  }
});

// PUT: Update an expense
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: "Failed to update expense" });
  }
});

// DELETE: Delete an expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete expense" });
  }
});

export default router;
