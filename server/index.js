const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

  const previousMessages = Array.isArray(history)
  ? history
      .filter(
        (item) =>
          item &&
          (item.role === "user" ||
            item.role === "assistant") &&
          typeof item.text === "string" &&
          item.text.trim()
      )
      .slice(-10)
      .map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text.slice(0, 4000) }],
      }))
  : [];

const contents = [
  ...previousMessages,
  {
    role: "user",
    parts: [{ text: message.trim() }],
  },
];

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents,
});

    res.json({
      reply: response.text || "No response generated.",
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});