const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(express.json());

// Frontend files (index.html, style.css, etc.) serve karne ke liye
app.use(express.static('.')); 

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing!");
}

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Message is required" });
        }

        // URL ke dono taraf backticks () lagaye hain taaki SyntaxError na aaye
        const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY};

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ reply: API Error: ${data.error.message || 'Unknown'} });
        }

        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response";

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Server error, please try again later" });
    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(🚀 Server running on port ${PORT}`);
});
