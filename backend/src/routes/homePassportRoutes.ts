
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import HomePassport from "../models/HomePassport";

const router = express.Router();

// GET: Fetch all home passport records
router.get("/", async (req: Request, res: Response) => {
  try {
    const homes = await HomePassport.find().sort({ createdAt: -1 });
    res.status(200).json(homes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch home passport records",
    });
  }
});

// GET: Fetch one home passport record
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid home passport ID" });
      return;
    }

    const home = await HomePassport.findById(req.params.id);

    if (!home) {
      res.status(404).json({ message: "Home passport record not found" });
      return;
    }

    res.status(200).json(home);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch home passport record",
    });
  }
});

// POST: Create a home passport record
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      homeName,
      address,
      propertyType,
      yearBuilt,
      area,
      notes,
    } = req.body;

    const home = await HomePassport.create({
      homeName,
      address,
      propertyType,
      yearBuilt,
      area,
      notes,
    });

    res.status(201).json({
      message: "Home passport record created successfully",
      home,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create home passport record",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT: Update a home passport record
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid home passport ID" });
      return;
    }

    const {
      homeName,
      address,
      propertyType,
      yearBuilt,
      area,
      notes,
    } = req.body;

    const home = await HomePassport.findByIdAndUpdate(
      req.params.id,
      {
        homeName,
        address,
        propertyType,
        yearBuilt,
        area,
        notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!home) {
      res.status(404).json({ message: "Home passport record not found" });
      return;
    }

    res.status(200).json({
      message: "Home passport record updated successfully",
      home,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update home passport record",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE: Remove a home passport record
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid home passport ID" });
      return;
    }

    const home = await HomePassport.findByIdAndDelete(req.params.id);

    if (!home) {
      res.status(404).json({ message: "Home passport record not found" });
      return;
    }

    res.status(200).json({
      message: "Home passport record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete home passport record",
    });
  }
});

export default router;
