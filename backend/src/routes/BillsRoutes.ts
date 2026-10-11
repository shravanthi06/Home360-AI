import { Router } from "express";
import Bills from "../models/Bills";

const router = Router();

// GET: Fetch all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Bills.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bills" });
  }
});

// POST: Add a bill
router.post("/", async (req, res) => {
  try {
    const { title, category, amount, dueDate, status, notes } = req.body;

    const bill = await Bills.create({
      title,
      category,
      amount,
      dueDate,
      status,
      notes,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ message: "Failed to add bill" });
  }
});

// PUT: Update a bill
router.put("/:id", async (req, res) => {
  try {
    const bill = await Bills.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bill) {
      res.status(404).json({ message: "Bill not found" });
      return;
    }

    res.json(bill);
  } catch (error) {
    res.status(400).json({ message: "Failed to update bill" });
  }
});

// DELETE: Remove a bill
router.delete("/:id", async (req, res) => {
  try {
    const bill = await Bills.findByIdAndDelete(req.params.id);

    if (!bill) {
      res.status(404).json({ message: "Bill not found" });
      return;
    }

    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete bill" });
  }
});

export default router;