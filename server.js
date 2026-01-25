require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Render ke Environment variables se key uthayega
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message missing" });

        // Flash 1.5 use karna hai - bina kisi version bracket ke
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Error:", error.message);
        // Error message ko detail mein bhejna taaki humein pata chale
        res.status(500).json({ error: "AI Error", details: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Rixo Server is Live on Port " + PORT);
});
