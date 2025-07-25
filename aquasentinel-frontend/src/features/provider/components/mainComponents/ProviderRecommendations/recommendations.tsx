import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";

interface Recommendation {
    farmname: string;
    farmowner: string;
    moisture: number;
    avgFlow: string;
    recommendation: string;
}

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const ProviderRecommendations: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();

    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {

            const res = await fetch("/api/sensors/provider-recommendations");
            if (!res.ok) {
                const dummy: Recommendation[] = [
                    {
                        farmname: "Green Valley",
                        farmowner: "Alice N.",
                        moisture: 43,
                        avgFlow: "1.8",
                        recommendation: "No irrigation needed today. Moisture is sufficient."
                    },
                    {
                        farmname: "Sunrise Farm",
                        farmowner: "Emmanuel M.",
                        moisture: 28,
                        avgFlow: "0.7",
                        recommendation: "Recommend irrigation tomorrow morning. Low moisture detected."
                    },
                    {
                        farmname: "Hope Farm",
                        farmowner: "Diane K.",
                        moisture: 15,
                        avgFlow: "0.4",
                        recommendation: "Urgent: Moisture very low. Irrigate today for at least 30 mins."
                    }
                ];
                setRecommendations(dummy);
            } else {
                const data = await res.json();
                console.log("AI API Recommendations:", data);
                setRecommendations(data);
            }
        }
        const interval = setInterval(fetchRecommendations, 60000);

        fetchRecommendations();
        setLoading(false);
        return () => clearInterval(interval);

    }, []);
    return (
        <div className="layout">
            {/* Header reused from FarmMonitoring */}
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/irrigation-sessions">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>

                    <h1>{t("providerRecommendations.title") || "AI-Powered Recommendations"}</h1>

                    <Link to="/dashboard/provider/export-center">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
                </div>

                <div className="header-nav">
                    <div className="header-language">
                        <label htmlFor="lang-select" className="profile-link" style={{ marginRight: "8px" }}>🌐</label>
                        <select
                            id="lang-select"
                            value={currentLang}
                            onChange={(e) => setLang(e.target.value)}
                            className="profile-link"
                            style={{
                                background: "#0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                fontSize: "16px",
                                color: "#fff",
                                cursor: "pointer",
                                borderColor: "#1568bb"
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/provider/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="Settings" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">
                            {t("dashboard.settings")}
                        </a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t("dashboard.logout")}</a>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="dashboard-main" style={{ padding: "2rem" }}>
                <div className="provrecommendations-container" style={{ padding: "2rem" }}>
                    <div className="provider-recommendations-header">
                        <h2>{t("providerRecommendations.subtitle") || "Overview of Smart AI Recommendations"}</h2>
                        <p>{t("providerRecommendations.description") || "Review suggestions for irrigation efficiency and farm support"}</p>
                    </div>
                    {loading ? (
                        <p>Loading recommendations...</p>
                    ) : (
                        <div style={{ marginTop: "2rem", overflowX: "auto", overflowY: "auto", maxHeight: "60vh" }}>
                            <table className="farm-table">
                                <thead>
                                    <tr>
                                        <th>Farm Name</th>
                                        <th>Farm Owner</th>
                                        <th>Moisture (%)</th>
                                        <th>Avg Flow (L/min)</th>
                                        <th>AI Recommendation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recommendations.map((rec, index) => (
                                        <tr key={index}>
                                            <td>{rec.farmname}</td>
                                            <td>{rec.farmowner}</td>
                                            <td>{rec.moisture ?? "N/A"}</td>
                                            <td>{rec.avgFlow}</td>
                                            <td style={{ maxWidth: "400px", whiteSpace: "pre-wrap" }}>{rec.recommendation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderRecommendations;
