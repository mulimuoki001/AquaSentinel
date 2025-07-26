import { useState } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import mockCompliance from "../ComplianceReports/mockComplianceReportsData";
import "../CSS/recommendationsPolicyInsights.css";
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});
console.log("VITE_OPENAI_API_KEY:", import.meta.env.VITE_OPENAI_API_KEY);

interface ComplianceData {
    district: string;
    zone: string;
    farms: number;
    compliant: number;
    avgEfficiency: number;
    waterUsed: number;
}

const formatComplianceData = (data: ComplianceData[]) => {
    return data.map((d) =>
        `District: ${d.district}, Zone: ${d.zone}, Farms: ${d.farms}, Compliant: ${d.compliant}, Avg Efficiency: ${d.avgEfficiency}%, Water Used: ${d.waterUsed}L`
    ).join("\n");
};

const RecommendationGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [recommendations, setRecommendations] = useState("");

    const handleGenerateSuggestions = async () => {
        setLoading(true);
        setError("");
        setRecommendations("");

        try {
            const formattedData = formatComplianceData(mockCompliance);
            const prompt = `
                You are a policy analyst for Rwanda's Ministry of Agriculture.

                Using the following district-level irrigation compliance data, write a detailed report for government officials. The report should include:

                1. A summary of the current situation
                2. Key regional trends and outliers
                3. Zones or districts needing urgent attention
                4. Recommendations for policy interventions
                5. Suggested next steps for national improvement

                Data:
                ${formattedData}

                Write the report clearly and professionally, And generte the report with good text formatting and structure. Make sure the report is complete and comprehensive, covering all the points mentioned above.
            `;

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300,
            });

            const suggestionText = response.choices?.[0]?.message?.content;
            setRecommendations(suggestionText || "No suggestions generated.");
        } catch (err) {
            console.error(err);
            setError("Failed to generate suggestions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommendation-box">
            <button onClick={handleGenerateSuggestions} className="generate-btn" disabled={loading}>
                {loading ? "Generating..." : "Generate Recent Policy Suggestions"}
            </button>

            <div className="ai-report">
                {error && <p className="error-msg">{error}</p>}

                {recommendations && (
                    <div className="suggestion-results">
                        <h3>Policy Insights & Recommendations:</h3>
                        <div >
                            <ReactMarkdown>{recommendations}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationGenerator;
