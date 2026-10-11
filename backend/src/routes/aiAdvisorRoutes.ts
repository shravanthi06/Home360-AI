
import express from "express";
import AIAdvisor from "../models/AIAdvisor";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Please check backend/.env"
  );
}

const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});

// Get saved questions and answers
router.get("/", async (_req, res) => {
  try {
    const advice = await AIAdvisor.find().sort({ createdAt: -1 });
    res.json(advice);
  } catch (error) {
    console.error("Fetch advice error:", error);
    res.status(500).json({ message: "Failed to fetch advice" });
  }
});

// Ask Gemini for simple home-related advice
router.post("/", async (req, res) => {
  try {
    const { question, category } = req.body;

    if (
      !question ||
      typeof question !== "string" ||
      !question.trim()
    ) {
      res.status(400).json({
        message: "Please enter a question.",
      });
      return;
    }

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `You are HOME360 AI, a friendly home management assistant.

Answer in simple, natural, easy-to-understand language.
Keep the answer short and useful, under 100 words.
Use 3 to 5 short bullet points when helpful.
Avoid long introductions, large headings, complex words, and unnecessary details.
Give practical advice about home maintenance, bills, budgeting, expenses,
appliances, cleaning, and household services.
If the question is unrelated to home management, politely guide the user
back to home-related topics.

Question: ${question.trim()}`,
    });

    const answer = result.text?.trim();

    if (!answer) {
      res.status(502).json({
        message: "Gemini returned an empty answer.",
      });
      return;
    }

    const savedAdvice = await AIAdvisor.create({
      question: question.trim(),
      category: category || "General",
      answer,
    });

    res.status(201).json(savedAdvice);
  } catch (error) {
    console.error("Gemini AI error:", error);

    res.status(500).json({
      message:
        "Unable to generate AI advice. Check the backend terminal.",
    });
  }
});

// Delete a saved question
router.delete("/:id", async (req, res) => {
  try {
    const advice = await AIAdvisor.findByIdAndDelete(req.params.id);

    if (!advice) {
      res.status(404).json({
        message: "Question not found",
      });
      return;
    }

    res.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete advice error:", error);
    res.status(500).json({
      message: "Failed to delete question",
    });
  }
});

export default router;
