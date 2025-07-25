import { Request, Response } from "express";
import { db } from "../config/db";
import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const getProviderRecommendations = async (req: Request, res: Response) => {
    try {
        const userQuery = await (await db).query(`
      SELECT id, name AS farmowner, farmname, farmphone
      FROM users
      WHERE role = 'farmer' AND name <> 'New Farmer';
    `);

        const farms = userQuery.rows;
        const recommendations = [];

        for (const farm of farms) {
            const { id: userId, farmname, farmowner } = farm;

            const moistureRes = await (await db).query(`
        SELECT moisture FROM moisture_data1
        WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1
      `, [userId]);
            const moisture = moistureRes.rows[0]?.moisture || null;

            const flowRes = await (await db).query(`
        SELECT AVG(flowrate) as avg_flow FROM water_flow_sensor_data
        WHERE userid = $1 AND date = CURRENT_DATE
      `, [userId]);
            const avgFlow = parseFloat(flowRes.rows[0]?.avg_flow || "0").toFixed(2);

            const sessionRes = await (await db).query(`
        SELECT date, duration, total_liters FROM pump_sessions
        WHERE user_id = $1 ORDER BY date DESC LIMIT 3
      `, [userId]);

            const sessionSummary = sessionRes.rows.map(s => `On ${s.date}, ${s.total_liters}L used in ${s.duration} mins`).join(". ");

            const prompt = `
        Analyze this irrigation data for a smallholder farm.
        Moisture: ${moisture}%. Avg flow: ${avgFlow} L/min.
        Last sessions: ${sessionSummary}.
        Should this farm irrigate today? Suggest schedule, duration, and reasoning. Be very brief and straightforward
      `;

            const aiRes = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert irrigation advisor. Analyze the data and recommend whether the provider should be concerned about the farm. Remember the farmer is not irrigating, the process is automatic. What the providers needs to know is could there be an issue with the suystem, leakages, pump is having issues, or soil moisture sensor has an issue.Be very brief and straightforward and don't start with yes or no. The recommendations are intended to help the providers know  what they should be concerned with or which farm or farmer needs  attention",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                max_tokens: 2048,
                temperature: 0.7,
            });


            const output = aiRes.choices[0]?.message?.content || "No recommendation available.";
            console.log(`Recommendation for ${farmname}, Farm Owner: ${farmowner}, Moisture: ${moisture}, Avg Flow: ${avgFlow}: ${output}`);

            recommendations.push({ farmname, farmowner, moisture, avgFlow, recommendation: output });
        }

        res.json(recommendations);

    } catch (error: unknown) {
        if (error instanceof Error && error.name === "RateLimitError") {
            res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
        }
        res.status(500).json({ error: "Internal server error.Failed to get provider recommendations" });
    }
};
