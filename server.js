require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Gemini Setup with API Key from Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Version 'v1' aur sahi model name ka fix
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
}, { apiVersion: 'v1' });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Generating response from Gemini
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error from Gemini:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Rixo server is running on port ${PORT});
});
