
import { Router } from "express";
import SmartSchedule from "../models/SmartSchedule";

const router = Router();

// GET: Fetch all scheduled tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await SmartSchedule.find().sort({ scheduledDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scheduled tasks" });
  }
});

// POST: Add a scheduled task
router.post("/", async (req, res) => {
  try {
    const task = await SmartSchedule.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to add scheduled task" });
  }
});

// PUT: Update a scheduled task
router.put("/:id", async (req, res) => {
  try {
    const task = await SmartSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ message: "Scheduled task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update scheduled task" });
  }
});

// DELETE: Delete a scheduled task
router.delete("/:id", async (req, res) => {
  try {
    const task = await SmartSchedule.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Scheduled task not found" });
      return;
    }

    res.json({ message: "Scheduled task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete scheduled task" });
  }
});

export default router;
