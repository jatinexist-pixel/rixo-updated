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

        if (!history || !Array.isArray(history) || history.length === 0) {
            return res.status(400).json({ reply: "History data array is required" });
        }

        if (!API_KEY) {
            return res.status(500).json({ reply: "OpenRouter API Key is missing in Vercel settings!" });
        }

        // System instructions to inject contextual boundaries cleanly
        const systemPrompt = {
            role: "system",
            content: "You are Rixo, a cool and intelligent AI companion. Keep casual talk or greetings strictly short (1-2 friendly lines max). If the user asks for a joke, tell a funny, fresh joke. If they ask for 'another' or follow up, remember the context from the chat history and provide a new joke accordingly. CRITICAL: If the user explicitly asks for code, programming scripts, algorithms, or technical queries, you MUST write the complete, clean code block wrapped inside triple backticks (```) so it can render properly. Never refuse to write code."
        };

        // Combining System Prompt with incoming dynamic frontend chat history log cleanly
        const combinedMessages = [systemPrompt, ...history];

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
                    messages: combinedMessages,
                    temperature: 0.85, 
                    max_tokens: 1000
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
