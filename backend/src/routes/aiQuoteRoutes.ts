
import { Router } from "express";
import mongoose from "mongoose";
import AIQuote from "../models/AIQuote";

const router = Router();

// GET: View all quotes
router.get("/", async (req, res) => {
  try {
    const quotes = await AIQuote.find().sort({ price: 1 });
    res.status(200).json(quotes);
  } catch (error) {
    console.error("FETCH QUOTES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch quotes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// POST: Add a quote
router.post("/", async (req, res) => {
  try {
    const {
      serviceName,
      providerName,
      price,
      warrantyMonths,
      estimatedDays,
      rating,
      description,
      status,
    } = req.body;

    if (!serviceName?.trim() || !providerName?.trim()) {
      res.status(400).json({
        message: "Service name and provider name are required.",
      });
      return;
    }

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      res.status(400).json({
        message: "Please enter a valid price greater than or equal to zero.",
      });
      return;
    }

    const quote = await AIQuote.create({
      serviceName: serviceName.trim(),
      providerName: providerName.trim(),
      price: Number(price),
      warrantyMonths: Number(warrantyMonths ?? 0),
      estimatedDays: Number(estimatedDays ?? 0),
      rating: Number(rating ?? 0),
      description: description ?? "",
      status: status ?? "Pending",
    });

    res.status(201).json(quote);
  } catch (error) {
    console.error("ADD QUOTE ERROR:", error);

    res.status(400).json({
      message: "Failed to add quote",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET: Compare quotes for a service
router.get("/compare/:serviceName", async (req, res) => {
  try {
    const serviceName = req.params.serviceName;

    const quotes = await AIQuote.find({
      serviceName: {
        $regex: serviceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      },
    }).sort({ price: 1 });

    if (quotes.length === 0) {
      res.status(404).json({
        message: "No quotes found for this service",
      });
      return;
    }

    const lowestPrice = Math.min(...quotes.map((quote) => quote.price));

    res.status(200).json({
      serviceName,
      totalQuotes: quotes.length,
      lowestPrice,
      quotes,
    });
  } catch (error) {
    console.error("COMPARE QUOTES ERROR:", error);

    res.status(500).json({
      message: "Failed to compare quotes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// PUT: Update a quote
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid quote ID" });
      return;
    }

    const quote = await AIQuote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quote) {
      res.status(404).json({ message: "Quote not found" });
      return;
    }

    res.status(200).json(quote);
  } catch (error) {
    console.error("UPDATE QUOTE ERROR:", error);

    res.status(400).json({
      message: "Failed to update quote",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// DELETE: Delete a quote
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid quote ID" });
      return;
    }

    const quote = await AIQuote.findByIdAndDelete(req.params.id);

    if (!quote) {
      res.status(404).json({ message: "Quote not found" });
      return;
    }

    res.status(200).json({
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("DELETE QUOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete quote",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
