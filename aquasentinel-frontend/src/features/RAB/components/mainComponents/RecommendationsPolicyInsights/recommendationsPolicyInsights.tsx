import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGlobalContext from "../../../../context/useGlobalContext";
import RecommendationGenerator from "./AIRecommendations";
import "../CSS/recommendationsPolicyInsights.css";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}




export const RecommendationsPolicyInsights: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    return (
        <div className="layout">
            {/* Topbar */}
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/RAB/compliance-reports">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text">
                        <h1>{t("rabRecommendations.pageTitle")}</h1>
                    </div>
                    <Link to="/dashboard/RAB">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
                </div>
                <div className="header-nav">
                    {/* Language Switcher */}
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
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                fontSize: "16px",
                                color: "#fff",
                                cursor: "pointer",
                                borderColor: "#1568bb",
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>

                    {/* Admin Settings */}
                    <div className="header-settings">
                        <Link to="/dashboard/RAB/admin-settings">
                            <img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/RAB/admin-settings">
                            {t("rabData.adminSettings")}
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

            {/* Main Content */}
            <div className="recommendations-policy-insights-container">
                <div className="recommendations-header">
                    <h2>{t("rabRecommendations.title") || "AI-Powered Recommendations"}</h2>
                </div>
                <div className="recommendation-generator">
                    <RecommendationGenerator />
                </div>
                <div className="policy-insights">
                    <h2>{t("rabPolicyInsights.title") || "Policy Insights"}</h2>
                    <p>{t("rabPolicyInsights.description") || "Generate insights based on compliance data."}</p>
                    <p>{t("rabPolicyInsights.note") || "Note: Ensure compliance data is up-to-date for accurate insights."}</p>
                </div>
            </div>
        </div>
    );
};
