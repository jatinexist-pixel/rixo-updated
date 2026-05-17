const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // Upgraded to Axios for zero URL parse issues

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

        const systemPrompt = {
            role: "system",
            content: "You are Rixo, a cool, witty, and highly intelligent AI companion. Keep casual talk, greetings, or short answers strictly to 1-2 friendly sentences. NEVER use huge paragraphs for basic chit-chat. If the user asks for a joke, tell a fresh, funny, and unique joke. If they say 'another', 'one more', or continue the topic, read the chat history to understand the context and give a completely new joke or relevant reply. CRITICAL: If the user asks for code, programming scripts, or technical algorithms, provide the full, complete code block wrapped inside triple backticks (```) properly formatted. Never refuse to give full code."
        };

        const combinedMessages = [systemPrompt, ...history];

        // Using Axios to guarantee clean HTTP parsing with OpenRouter
        const response = await axios.post(
            "[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)",
            {
                model: "meta-llama/llama-3-70b-instruct", 
                messages: combinedMessages,
                temperature: 0.85,
                max_tokens: 1200
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const botReply = response.data?.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error.response?.data || error.message);
        res.status(500).json({
            reply: "Server error: " + (error.response?.data?.error?.message || error.message)
        });
    }
});

module.exports = app;
