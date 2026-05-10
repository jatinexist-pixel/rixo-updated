import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Sabse stable model use kar rahe hain
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ reply: "Bhai, API side pe kuch locha hai. Key check kar le ek baar." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
