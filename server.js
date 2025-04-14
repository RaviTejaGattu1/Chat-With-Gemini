const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parse } = require('csv-parse');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

// Existing /chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get response from Gemini' });
    }
});

// New endpoint to serve milk price data
app.get('/milk-prices', (req, res) => {
    const data = [];
    fs.createReadStream('data/APU0000709112.csv')
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (row) => {
            data.push([row.observation_date, parseFloat(row.APU0000709112)]);
        })
        .on('end', () => {
            res.json(data);
        })
        .on('error', (error) => {
            res.status(500).json({ error: 'Failed to read CSV data' });
        });
});

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});
