
import { Router } from "express";
import HomeService from "../models/HomeService";

const router = Router();

// GET: View all service requests
router.get("/", async (req, res) => {
  try {
    const services = await HomeService.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// POST: Create a service request
router.post("/", async (req, res) => {
  try {
    const service = await HomeService.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: "Failed to create service request" });
  }
});

// PUT: Update a service request
router.put("/:id", async (req, res) => {
  try {
    const service = await HomeService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      res.status(404).json({ message: "Service request not found" });
      return;
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({ message: "Failed to update service request" });
  }
});

// DELETE: Remove a service request
router.delete("/:id", async (req, res) => {
  try {
    const service = await HomeService.findByIdAndDelete(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service request not found" });
      return;
    }

    res.json({ message: "Service request deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete service request" });
  }
});

export default router;
