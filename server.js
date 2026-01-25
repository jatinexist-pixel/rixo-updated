require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'Rixo AI Server Live!', 
        timestamp: new Date().toISOString() 
    });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'No message provided' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(message);
        const reply = result.response.text();
        
        res.json({ reply: reply });
        
    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({ 
            error: 'AI service unavailable',
            details: error.message 
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log("Rixo server running on port " + port);  // NO EMOJIS, NO TEMPLATE LITERALS
});
