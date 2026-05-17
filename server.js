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
                    model: "openrouter/auto", 
                    messages: [
                        {
                            // SYSTEM PROMPT ADDED: Ab ye dost ki tarah chote reply dega, bas technical sawaal par bade paragraphs dega
                            role: "system",
                            content: "You are Rixo, a close friend of the user. Keep your casual chat greetings and regular conversation extremely short, witty, and friendly (just like a friend on WhatsApp). Do not write paragraphs for normal talks. However, if the user asks for pure knowledge, programming, logic, definitions, or college-related educational questions, then provide comprehensive, clear, and structured long paragraphs or code blocks as an expert guide."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            return res.json({ reply: "OpenRouter Error: " + data.error.message });
        }

        const botReply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
            ? data.choices[0].message.content
            : "No response from OpenRouter Auto routing.";

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
