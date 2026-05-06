import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 🔑 Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: message
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      reply: "I am currently experiencing a technical issue. Please try again shortly."
    });
  }
});

// ✅ Test route (VERY IMPORTANT)
app.get("/test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Say hello professionally"
    });

    res.send(response.text);
  } catch (e) {
    console.error(e);
    res.send("Error");
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Rixo AI server is running 🚀");
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
