const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !API_KEY) {
            return res.status(400).json({ reply: "Missing history or API key" });
        }

        const systemPrompt = {
            role: "system",
            content: "You are Rixo, a cool AI companion. Keep answers short (1-2 sentences). Always remember the chat history to handle follow-up words like 'another'. If the user asks for code, provide the full code wrapped inside triple backticks (```)."
        };

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY.trim(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-70b-instruct",
                messages: [systemPrompt, ...history],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't get that.";
        res.json({ reply });

    } catch (error) {
        res.status(500).json({ reply: "Server error: " + error.message });
    }
});

module.exports = app;
