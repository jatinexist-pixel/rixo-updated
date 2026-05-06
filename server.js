const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Gemini Setup - Environment variable check ke saath
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Yahan model ka naam ekdum latest aur specific rakha hai
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message" });

    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    // Agar model nahi mil raha toh error message bhejega
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Rixo Server is Active!");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
