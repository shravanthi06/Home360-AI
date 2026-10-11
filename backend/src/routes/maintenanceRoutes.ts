
import { Router } from "express";
import Maintenance from "../models/Maintenance";

const router = Router();

// GET: Fetch all maintenance tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Maintenance.find().sort({ scheduledDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch maintenance tasks" });
  }
});

// POST: Add a maintenance task
router.post("/", async (req, res) => {
  try {
    const task = await Maintenance.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to add maintenance task" });
  }
});

// PUT: Update a maintenance task
router.put("/:id", async (req, res) => {
  try {
    const task = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ message: "Maintenance task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update maintenance task" });
  }
});

// DELETE: Delete a maintenance task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Maintenance.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Maintenance task not found" });
      return;
    }

    res.json({ message: "Maintenance task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete maintenance task" });
  }
});

export default router;
