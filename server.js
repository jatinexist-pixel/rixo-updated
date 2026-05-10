import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

// API key check
if (!API_KEY) {
    console.error("GEMINI_API_KEY missing in environment variables");
    process.exit(1);
}

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Message validation
        if (!message) {
            return res.status(400).json({
                reply: "Message required hai."
            });
        }

        const url =
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY};

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: message
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        // Google API error handling
        if (!response.ok || data.error) {
            console.error("Google API Error:", data);

            return res.status(500).json({
                reply:
                    data?.error?.message ||
                    "Google API se response nahi mila."
            });
        }

        // Safe optional chaining
        const botReply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Koi response nahi mila.";

        res.json({
            reply: botReply
        });

    } catch (error) {
        console.error("Server Error:", error);

        res.status(500).json({
            reply: "Backend me connection ki dikkat hai."
        });
    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(Server Live on Port ${PORT});
});
