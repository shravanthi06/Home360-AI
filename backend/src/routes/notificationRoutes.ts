
import { Router } from "express";
import Notification from "../models/Notification";

const router = Router();

// GET: Fetch all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// POST: Create a notification
router.post("/", async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: "Failed to create notification" });
  }
});

// PUT: Update notification (for example, mark as read)
router.put("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: "Failed to update notification" });
  }
});

// DELETE: Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete notification" });
  }
});

export default router;
