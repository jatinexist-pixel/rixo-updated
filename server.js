const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Updated model config for stability and professional English responses
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are Rixo AI, a professional and intelligent assistant. You must always communicate in professional English. Ensure your responses are helpful, clear, and sophisticated."
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    // Professional English error fallback
    res.status(500).json({ reply: "I am currently experiencing a technical difficulty. Please try again shortly." });
  }
});

app.get("/", (req, res) => {
  res.send("Rixo Professional Server is Online.");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
