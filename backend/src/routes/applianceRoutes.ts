
import { Router } from "express";
import Appliance from "../models/Appliance";

const router = Router();

// GET: Fetch all appliances
router.get("/", async (req, res) => {
  try {
    const appliances = await Appliance.find().sort({ createdAt: -1 });
    res.json(appliances);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appliances" });
  }
});

// POST: Add an appliance
router.post("/", async (req, res) => {
  try {
    const appliance = await Appliance.create(req.body);
    res.status(201).json(appliance);
  } catch (error) {
    res.status(400).json({ message: "Failed to add appliance" });
  }
});

// PUT: Update an appliance
router.put("/:id", async (req, res) => {
  try {
    const appliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appliance) {
      res.status(404).json({ message: "Appliance not found" });
      return;
    }

    res.json(appliance);
  } catch (error) {
    res.status(400).json({ message: "Failed to update appliance" });
  }
});

// DELETE: Delete an appliance
router.delete("/:id", async (req, res) => {
  try {
    const appliance = await Appliance.findByIdAndDelete(req.params.id);

    if (!appliance) {
      res.status(404).json({ message: "Appliance not found" });
      return;
    }

    res.json({ message: "Appliance deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete appliance" });
  }
});

export default router;
