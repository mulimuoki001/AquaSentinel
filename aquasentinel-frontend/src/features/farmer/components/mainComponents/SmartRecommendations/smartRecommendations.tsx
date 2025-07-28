import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}
interface AIResponse {
    prompt: string;
    response: string;
}

interface FlowData {
    id: number;
    userid: number;
    flowrate: number;
    flowunit: string;
    pumpstatus: "ON" | "OFF";
    timestamp: string;
    date: string;
    time: string;
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
    const [flowData, setFlowData] = useState<FlowData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

    })

    useEffect(() => {
        const fetchFlowData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const res = await fetch(`/api/sensors/all-water-flow-data-per-user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }

                const json = await res.json();
                setFlowData(json.data || []);

            } catch (err: any) {
                console.error("❌ Error fetching flow data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlowData();
    }, []);

    const formatSensorPrompt = (data: any, lang: string) => {
        const flows = data.waterFlowData.map(
            (d: { time: string; flowrate: number }) => `- ⏱ Time: ${d.time}, 💧 Flowrate: ${d.flowrate} L/min`
        ).join("\n");

        const moistures = data.moistureData.map(
            (d: { time: string; moisture: number }) => `- ⏱ Time: ${d.time}, 🌱 Moisture: ${d.moisture}%`
        ).join("\n");

        return `
        You are a helpful irrigation assistant. Based on the following data collected on **${todayDay}**, generate a markdown-formatted report to advise a smallholder farmer in Rwanda.

        ### 📊 Water Flow Readings
        ${flows}

        ### 🌱 Soil Moisture Readings
        ${moistures}

        ---

        ### 💡 What To Include in Your Report:

        1. **General Summary** of irrigation condition.
        2. Bullet-point **recommendations** based on trends or low values.
        3. Use simple, clear, and helpful language.
        4. Format it for readability.

        Respond in **${lang === "rw" ? "Kinyarwanda" : "English"}** only.
            `;
    };


    const handleAskAI = async (customPrompt?: string, useSensorData = false) => {
        setLoading(true);

        try {
            let promptToSend = customPrompt || input;



            if (useSensorData) {
                promptToSend = formatSensorPrompt(
                    {
                        waterFlowData: flowData,
                        moistureData: [], // Optional: add real moisture later
                    },
                    currentLang
                );
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
                    {isLoading && (
                        <div style={{ padding: "12px", color: "#1568bb", fontWeight: "bold", textAlign: "center" }}>
                            🔄 Loading your recent sensor data...
                        </div>
                    )}

                    <div className="chat-buttons">
                        <button onClick={() => handleAskAI(`Suggest smart irrigation advice based on recent pump sessions for farmer ${userName}`, true)}
                            disabled={loading} className="suggest-btn">
                            {loading ? t("recommendations.thinking") : t("recommendations.generateInsights")}
                        </button>
                        <button
                            onClick={() => {
                                setMessages([]);
                                localStorage.removeItem("provider_ai_recommendations");
                            }}
                            className="clear-history-btn"
                        >
                            {t("recommendations.clearHistory")}
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className="ai-chat-bubble">
                                <p><strong>🧑 Prompt:</strong> {m.prompt.slice(0, 100)}...</p>
                                <p><strong>🤖 Response:</strong></p>
                                <ReactMarkdown>{m.response}</ReactMarkdown>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t("recommendations.inputPlaceholder")}
                        />
                        <button onClick={() => handleAskAI()} disabled={loading || !input}>{t("recommendations.send")}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
