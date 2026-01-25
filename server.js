require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const result = await model.generateContent(message);
        const text = result.response.text();
        res.json({ reply: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
// Niche wali line dhyan se dekho, simple quotes use kiye hain error se bachne ke liye
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
