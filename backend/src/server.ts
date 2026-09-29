import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HOME360 AI Backend is running!");
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(5000, () => {
      console.log("Backend running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });