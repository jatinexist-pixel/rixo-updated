import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, {apiVersion:'v1 });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "API Error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
