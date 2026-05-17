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

        // Switching to Meta Llama 3 70B (Instruct) for robust custom prompt parsing and perfect coding output
        const response = await fetch(
            "[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3-70b-instruct", 
                    messages: [
                        {
                            role: "system",
                            content: "You are Rixo, a cool AI friend. For casual talk or greetings, reply in just 1-2 friendly sentences. Never use paragraphs for basic chit-chat. If the user asks for a joke, tell a completely unique, fresh, and modern joke, using distinct creative contexts each time so it never repeats. CRITICAL: If the user explicitly asks for code, programming scripts, algorithms, or technical queries, you MUST write the complete, clean code block wrapped inside triple backticks (`) so it can render properly. Never refuse to write code."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.95, // Maximize creativity to avoid joke repetition entirely
                    max_tokens: 1000 // Increased tokens so full code snippets don't get cut off
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
