import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in environment variables!");
}

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ reply: "Message is required and should be a string" });
        }

        const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY};

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        // Google API error handling
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ 
                reply: Google Error: ${data.error.message || 'Unknown error'} 
            });
        }

        // Safe extraction of response text
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!botReply) {
            return res.status(500).json({ reply: "No response from Gemini" });
        }

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Connection Error! Please try again." });
    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(🚀 Server is running on port ${PORT});
});
