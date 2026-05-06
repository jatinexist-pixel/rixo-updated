const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 🔑 Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ FIXED MODEL (no more 404 error)
const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
  systemInstruction:
    "You are Rixo AI, a professional and intelligent assistant. Always reply in professional English."
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      reply: "I am currently experiencing a technical difficulty. Please try again shortly."
    });
  }
});

// ✅ Test route (VERY IMPORTANT)
app.get("/test", async (req, res) => {
  try {
    const result = await model.generateContent("Say hello professionally");
    const text = result.response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.send("Error in test route");
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Rixo Professional Server is Online.");
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
