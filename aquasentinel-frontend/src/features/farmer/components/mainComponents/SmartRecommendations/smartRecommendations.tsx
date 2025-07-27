import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}
interface AIResponse {
    prompt: string;
    response: string;
}

export const SmartRecommendations: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang, userData } = useGlobalContext();
    const { t } = useTranslation();
    const todayDay = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const userName = userData?.name || "User";
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<AIResponse[]>(() => {
        return JSON.parse(localStorage.getItem("farmer_ai_recommendations") || "[]");
    });
    const fetchSensorData = async (userId: number) => {
        const res = await fetch(`/api/sensors/user-sensor-data/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch sensor data");
        return res.json();
    };

    const formatSensorPrompt = (data: any, lang: string) => {
        const flows = data.waterFlowData.map(
            (d: { time: string; flowrate: number }) => `Time: ${d.time}, Flowrate: ${d.flowrate} L/min`
        ).join("\n");

        const moistures = data.moistureData.map(
            (d: { time: string; moisture: number }) => `Time: ${d.time}, Moisture: ${d.moisture}%`
        ).join("\n");

        return `
        You are a helpful irrigation assistant. Provide smart advice for a Rwandan farmer using the following data:

        Water Flow Readings:
            ${flows}

            Soil Moisture Readings:
            ${moistures}

            Suggest short and relevant tips in ${lang === "rw" ? "Kinyarwanda" : "English"}.
            Also make some recommendations based on today's date: ${todayDay}
            Use the latest data for your suggestions and complete all recommendations in a single response.
            `;
    };

    const handleAskAI = async (customPrompt?: string, useSensorData = false) => {
        setLoading(true);

        try {
            let promptToSend = customPrompt || input;

            if (useSensorData && userData?.id) {
                const sensorData = await fetchSensorData(userData.id);
                promptToSend = formatSensorPrompt(sensorData, currentLang);
            }

            const res = await fetch("/api/farmer-ai/smart-recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptToSend }),
            });

            const data = await res.json();
            const newEntry = { prompt: promptToSend, response: data.content };

            const updated = [newEntry, ...messages].slice(0, 3);
            setMessages(updated);
            localStorage.setItem("farmer_ai_recommendations", JSON.stringify(updated));
            setInput("");
        } catch (err) {
            alert("AI suggestion failed.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="layout">
            {/* Header */}
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/irrigation-history">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text">
                        <h1>{t("recommendations.pageTitle")}</h1>
                    </div>
                    <Link to="/dashboard/farmer/export-logs">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
                </div>

                <div className="header-nav">
                    {/* Language */}
                    <div className="header-language">
                        <label htmlFor="lang-select" className="profile-link" style={{ marginRight: "8px" }}>
                            🌐
                        </label>
                        <select
                            id="lang-select"
                            value={currentLang}
                            onChange={(e) => setLang(e.target.value)}
                            className="profile-link"
                            style={{
                                background: "#0e2c38",
                                border: "1px solid #1568bb",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>

                    {/* Settings */}
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="settings" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">
                            {t("dashboard.settings")}
                        </a>
                    </div>

                    {/* Logout */}
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>
                            {t("dashboard.logout")}
                        </a>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="smart-recommendations-container">
                <div className="smart-ai-chat-box">
                    <div className="chat-header">
                        <div className="chart-header">
                            <h2>{t("recommendations.title")}</h2>
                        </div>
                    </div>

                    <div className="chat-buttons">
                        <button onClick={() => handleAskAI(`Suggest smart irrigation advice based on recent pump sessions for farmer ${userName}`, true)}
                            disabled={loading} className="suggest-btn">
                            {loading ? "Thinking..." : "🧠 Generate AI Suggestions from My Data"}
                        </button>
                        <button
                            onClick={() => {
                                setMessages([]);
                                localStorage.removeItem("provider_ai_recommendations");
                            }}
                            className="clear-history-btn"
                        >
                            Clear History
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className="ai-chat-bubble">
                                <p><strong>🧑 You:</strong> {m.prompt}</p>
                                <p><strong>🤖 AI:</strong> {m.response}</p>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about irrigation..."
                        />
                        <button onClick={() => handleAskAI()} disabled={loading || !input}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
