const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

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
            content: "You are Rixo, a cool, witty AI friend. CRITICAL: Keep casual talk, jokes, or greetings strictly to 1-2 short sentences. NEVER use paragraphs for basic chat. Remember the chat history context to answer continuous questions like 'another one' or 'why?'. If the user asks for code, provide the full clean code wrapped in triple backticks (```)."
        };

        const combinedMessages = [systemPrompt, ...history];

        const response = await axios.post(
            "[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)",
            {
                model: "meta-llama/llama-3-70b-instruct", 
                messages: combinedMessages,
                temperature: 0.85,
                max_tokens: 1000
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
