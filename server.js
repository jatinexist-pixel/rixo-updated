import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Dhyaan se dekho, ye backticks () use kiye hain, single quotes nahi
        const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ reply: "Google Error: " + data.error.message });
        }

        const botReply = data.candidates[0].content.parts[0].text;
        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Backend connection error!" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server Live on Port " + PORT));
