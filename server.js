const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000; // Render ke liye 10000 best hai

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Yahan maine "gemini-pro" kar diya hai jo jyada stable hai
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Rixo AI Server is running!");
});

app.listen(port, () => {
  console.log(Server is running on port ${port});
});
