const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.send("Rixo AI Backend is Running! 🚀");
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userMessage);
        const aiReply = result.response.text();

        res.json({ reply: aiReply });
    } catch (error) {
        console.error("Server Error →", error);
        res.status(500).json({ reply: "Server error, try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Rixo backend running on port ${PORT}));
