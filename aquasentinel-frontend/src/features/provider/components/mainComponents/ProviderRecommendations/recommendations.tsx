// SmartRecommendations.tsx
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import mockFarmsData from "../MockData/mockFarmsData";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

interface AIResponse {
    prompt: string;
    response: string;
}

export const ProviderSmartRecommendations: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
    const todayDay = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<AIResponse[]>(() => {
        return JSON.parse(localStorage.getItem("provider_ai_recommendations") || "[]");
    });

    const formatFarmPrompt = (lang: string) => {
        const summaries = mockFarmsData.map(farm => `Farm: ${farm.farmName}, Owner: ${farm.owner}, Moisture: ${farm.moisture}%, Efficiency: ${farm.avgEfficiency}%, Pump: ${farm.pumpStatus}`).join("\n");

        return `
You are an intelligent farm advisor. Based on today's overview (${todayDay}), analyze the following farm data and generate a well-structured, human-friendly report. Use markdown-style formatting or clear bullet points for readability.

Farm Data:
${summaries}

In your response, include:
1. A **brief overview** of general farm performance.
2. **Per-farm insights** with:
   - Farm Name and Owner
   - Moisture %, Efficiency %, and Pump Status
   - Clear actionable recommendation (bold it)
3. Format the response clearly with line breaks and headings.

Respond in ${lang === "rw" ? "Kinyarwanda" : "English"} only.
`;

    };

    const handleAskAI = async (customPrompt?: string) => {
        setLoading(true);
        try {
            const promptToSend = customPrompt || formatFarmPrompt(currentLang);
            const res = await fetch("/api/provider-ai/generate-farm-monitoring-recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptToSend })
            });
            const data = await res.json();
            const newEntry = { prompt: promptToSend, response: data.content };
            const updated = [newEntry, ...messages].slice(0, 3);
            setMessages(updated);
            localStorage.setItem("provider_ai_recommendations", JSON.stringify(updated));
            setInput("");
        } catch (err) {
            alert("AI suggestion failed.");
        } finally {
            setLoading(false);
        }
    };
    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem("provider_ai_recommendations");
    };

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/irrigation-sessions ">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text">
                        <h1>{t('providerSmartRecommendations.title')}</h1>
                    </div>
                    <Link to="/dashboard/provider/export-center">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
                </div>

                <div className="header-nav">
                    <div className="header-language">
                        <label htmlFor="lang-select" className="profile-link" style={{ marginRight: "8px" }}>🌐</label>
                        <select id="lang-select" value={currentLang} onChange={(e) => setLang(e.target.value)} className="profile-link"
                            style={{ background: "#0e2c38", border: "1px solid #1568bb", padding: "4px 6px", borderRadius: "4px", color: "#fff", fontSize: "16px", cursor: "pointer" }}>
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/provider/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="settings" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">Settings</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>

            <div className="smart-recommendations-container">
                <div className="smart-ai-chat-box">
                    <div className="chat-header">
                        <h2>{t('providerSmartRecommendations.assistantTitle')}</h2>
                    </div>
                    <div className="chat-buttons">
                        <button onClick={() => handleAskAI()} disabled={loading} className="suggest-btn">
                            {loading ? t('providerSmartRecommendations.thinking') : t('providerSmartRecommendations.generateInsights')}
                        </button>
                        <button onClick={clearHistory} className="clear-history-btn">
                            {t('providerSmartRecommendations.clearHistory')}
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className="ai-chat-bubble">
                                <p><strong>🧑 Prompt:</strong> {m.prompt.slice(0, 100)}...</p>

                                <p><strong>🤖 AI:</strong> {m.response}</p>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('providerSmartRecommendations.inputPlaceholder')}
                        />
                        <button onClick={() => handleAskAI(input)} disabled={loading || !input}>{t('providerSmartRecommendations.send')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderSmartRecommendations;
