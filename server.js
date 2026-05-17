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
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Message is required" });
        }

        if (!API_KEY) {
            return res.status(500).json({ reply: "OpenRouter API Key is missing in Vercel settings!" });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    messages: [
                        {
                            role: "system",
                            content: "You are Rixo, a friendly and cool companion. For casual talks, greetings, 'hi', 'hello', or normal chat, reply extremely shortly in just 1 or 2 lines like a friend on WhatsApp. Do not write long paragraphs for general chat. If the user asks for a joke, tell a totally unique, funny, and fresh joke every time. Do not repeat the same joke. However, if the user asks an educational, technical, coding, mathematical, or knowledge-based question, provide a detailed, well-structured paragraph or code explanation."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.9, // Higher temperature so AI gives totally unique, non-repeating jokes
                    max_tokens: 500
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            return res.json({ reply: "OpenRouter Error: " + data.error.message });
        }

        const botReply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
            ? data.choices[0].message.content
            : "Sorry, I couldn't process that.";

        res.json({
            reply: botReply
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            reply: "Server error: " + error.message
        });
    }
});

module.exports = app;
