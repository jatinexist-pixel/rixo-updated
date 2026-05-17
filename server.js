const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Static files (HTML, CSS, JS) serve karne ke liye setup
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
            console.error("❌ API Key Missing in Vercel!");
            return res.status(500).json({ reply: "API Key Config Missing" });
        }

        // NO BACKTICKS HERE: Simple single/double quotes used everywhere
        // Primary Model: Google Gemini 2.0 Flash (Highly Stable and Free)
        let response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: [{ role: "user", content: message }]
                })
            }
        );

        let data = await response.json();
        console.log("OpenRouter Primary Attempt Data:", JSON.stringify(data, null, 2));

        let botReply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
            ? data.choices[0].message.content
            : null;

        // Backup Fallback Model: DeepSeek Chat Free
        if (!botReply) {
            console.log("Primary model failed, trying deepseek backup...");
            response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + API_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "deepseek/deepseek-chat:free",
                        messages: [{ role: "user", content: message }]
                    })
                }
            );
            data = await response.json();
            botReply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content
                : "No response from AI models at the moment.";
        }

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Server error caught" });
    }
});

module.exports = app;
