const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat Endpoint
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "API Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
