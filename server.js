const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Yeh model name universal hai, isme error nahi aayega
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message" });

    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "Dost, server mein thodi dikkat hai, par hum solve kar lenge!" });
  }
});

app.get("/", (req, res) => {
  res.send("Rixo Server is Active!");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
