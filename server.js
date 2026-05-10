import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sabse zyada compatible model
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("API Error Details:", error);
        res.status(500).json({ reply: "Bhai, API ne phir mana kar diya. Key check kar." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server Live on " + PORT));
