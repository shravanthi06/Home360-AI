import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HOME360 AI Backend is running!");
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});