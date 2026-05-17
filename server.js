const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const API_KEY = process.env.GEMINI_API_KEY;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                reply: "Message is required"
            });
        }

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: message }]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({
    reply: `API Error: ${data.error.message || 'Unknown'}`
});
        }

        const botReply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        res.json({ reply: botReply });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            reply: "Server error"
        });
    }
});

module.exports = app;
