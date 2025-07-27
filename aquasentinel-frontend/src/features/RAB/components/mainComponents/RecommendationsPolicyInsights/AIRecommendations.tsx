"use server";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import mockCompliance from "../ComplianceReports/mockComplianceReportsData";
import "../CSS/recommendationsPolicyInsights.css";
import { useTranslation } from "react-i18next";
// const openai = new OpenAI({
//     apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//     dangerouslyAllowBrowser: true,
// });
// console.log("VITE_OPENAI_API_KEY:", import.meta.env.VITE_OPENAI_API_KEY);

interface ComplianceData {
    district: string;
    zone: string;
    farms: number;
    compliant: number;
    avgEfficiency: number;
    waterUsed: number;
}
interface AIResponse {
    prompt: string;
    response: string;
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
    const { t } = useTranslation();
    const todayDay = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<AIResponse[]>(() => {
        return JSON.parse(localStorage.getItem("provider_ai_recommendations") || "[]");
    });

    const ClearHistory = () => {
        setMessages([]);
        localStorage.removeItem("provider_ai_recommendations");
    }
    const formattedData = formatComplianceData(mockCompliance);
    const formattedPrompt = `
                You are a policy analyst for Rwanda's Ministry of Agriculture.

                Using the following district-level irrigation compliance data, write a detailed report for government officials. The report should include:

                1. A summary of the current situation
                2. Key regional trends and outliers
                3. Zones or districts needing urgent attention
                4. Recommendations for policy interventions
                5. Suggested next steps for national improvement

                Data:
                ${formattedData}

                Write the report clearly and professionally, And generate the report with good text formatting and structure. Make sure the report is complete and comprehensive, covering all the points mentioned above and ${todayDay}.
            `;

    const handleGenerateSuggestions = async (customPrompt?: string) => {
        setLoading(true);
        setError("");
        setRecommendations("");

        try {
            const promptToSend = customPrompt || formattedPrompt;


            const response = await fetch("/api/rab-ai/generate-policy-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptToSend }),
            });

            const result = await response.json();
            const newEntry = { prompt: promptToSend, response: result.content || "No suggestions generated." };
            const updated = [newEntry, ...messages].slice(0, 3);
            setMessages(updated);
            localStorage.setItem("rab_ai_recommendations", JSON.stringify(updated));
            setInput("");
            setRecommendations(result.content || "No suggestions generated.");
        } catch (err) {
            const response = await fetch("/api/rab-ai/generate-policy-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const suggestionText = await response.json();
            setRecommendations(suggestionText.content || "No suggestions generated.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommendation-box">
            <div className="smart-ai-chat-box">
                <div className="chat-header">
                    <h2>{t('rabRecommendations.assistantTitle')}</h2>
                </div>
                <div className="chat-buttons">
                    <button onClick={() => handleGenerateSuggestions()} className="generate-btn" disabled={loading}>
                        {loading ? "Generating..." : "Generate Recent Policy Suggestions"}
                    </button>
                    <button onClick={ClearHistory} className="clear-history-btn">
                        {t('rabRecommendations.clearHistory')}
                    </button>
                </div>

                <div className="ai-report">
                    {error && <p className="error-msg">{error}</p>}

                    {recommendations && (
                        <div className="suggestion-results">
                            <h3>Policy Insights & Recommendations:</h3>
                            <div >
                                <ReactMarkdown>{messages[0]?.response}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('providerSmartRecommendations.inputPlaceholder')}
                    />
                    <button onClick={() => handleGenerateSuggestions(input)} disabled={loading || !input}>{t('providerSmartRecommendations.send')}</button>
                </div>
            </div>
        </div>


    );
};

export default RecommendationGenerator;
