// server/routes/openai.js
import express from "express";
import OpenAI from "openai";

const AIProviderrouter = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

AIProviderrouter.post("/generate-farm-monitoring-recommendations", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
        });

        console.log(response.choices[0].message.content);

        res.json({ content: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OpenAI API call failed" });
    }
});

export default AIProviderrouter;
