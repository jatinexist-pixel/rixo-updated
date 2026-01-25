require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
    res.json({ status: 'Rixo AI Server Live! (OpenAI Powered)' });
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'No message provided' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Free tier friendly
            messages: [{ role: "user", content: message }]
        });
        
        const reply = completion.choices[0].message.content;
        res.json({ reply: reply });
        
    } catch (error) {
        console.error('OpenAI error:', error.message);
        res.status(500).json({ error: 'AI service unavailable' });
    }
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log("Rixo server running on port " + port);
});
