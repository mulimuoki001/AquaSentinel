import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGlobalContext from "../../../../context/useGlobalContext";
import { policyAlerts } from "./dummyAlerts";
import "../CSS/rabAlerts.css"
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}




export const AlertsRAB: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();


    return (
        <div className="layout">
            {/* Topbar */}
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">

                    <Link to="/dashboard/RAB/district-zone-monitoring">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-tex">
                        <h1>{t("rabAlerts.liveAlerts")}</h1>
                    </div>
                    <Link to="/dashboard/RAB/compliance-reports">
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
            <div className="layout">
                <div className="rab-alerts-container">
                    <div className="rab-alerts-header">
                        <h1>{t("rabAlerts.liveAlertsTitle")}</h1>
                        <p>{t("rabAlerts.liveAlertsDescription")}</p>
                    </div>

                    <div className="rab-alerts-grid">
                        {policyAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`rab-alert-card severity-${alert.severity.toLowerCase()} ${alert.status === "Resolved" ? "resolved" : ""
                                    }`}
                            >
                                <div className="rab-alert-meta">
                                    <span className="region">{alert.region}</span>
                                    <span className="timestamp">
                                        {new Date(alert.timestamp).toLocaleString(currentLang)}
                                    </span>
                                </div>
                                <h3>{alert.category}</h3>
                                <p className="description">{alert.description}</p>
                                <div className="status-badge">{alert.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};
