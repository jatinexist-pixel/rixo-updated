const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-chat-v3-0324:free",
                    messages: [
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        const botReply =
            data?.choices?.[0]?.message?.content ||
            "No response";

        res.json({
            reply: botReply
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            reply: "Server error"
        });
    }
});
