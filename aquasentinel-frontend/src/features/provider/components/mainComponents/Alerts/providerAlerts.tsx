// src/features/provider/components/ProviderAlerts.tsx
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import "../CSS/providerAlerts.css";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

interface Alert {
    message: string;
    timestamp: string;
    severity: "info" | "warning" | "danger";
    category: string;
    location: string;
}

const ProviderAlerts: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();

    const dummyAlerts: Alert[] = [
        {
            message: "Moisture critically low on Farm A (18%)",
            timestamp: "2025-07-26 07:40",
            severity: "danger",
            category: "Moisture",
            location: "Ngoma"
        },
        {
            message: "Pump OFF on Farm B for over 6 hours",
            timestamp: "2025-07-26 06:20",
            severity: "warning",
            category: "Pump",
            location: "Kirehe"
        },
        {
            message: "Farm C efficiency dropped to 35%",
            timestamp: "2025-07-25 22:15",
            severity: "warning",
            category: "Efficiency",
            location: "Bugesera"
        },
        {
            message: "Excessive water usage detected on Farm D",
            timestamp: "2025-07-25 19:02",
            severity: "danger",
            category: "Usage",
            location: "Nyagatare"
        },
        {
            message: "No irrigation in last 5 days on Farm E",
            timestamp: "2025-07-25 15:50",
            severity: "warning",
            category: "Irrigation",
            location: "Gatsibo"
        },
        {
            message: "Maintenance request submitted by Farmer Jane",
            timestamp: "2025-07-25 14:00",
            severity: "info",
            category: "Maintenance",
            location: "Rwamagana"
        },
        {
            message: "Smart recommendation sent to 3 farms",
            timestamp: "2025-07-25 13:40",
            severity: "info",
            category: "AI Advisory",
            location: "Huye"
        }
    ];

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/export-center">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-tex">
                        <h1>{t("providerAlerts.title") || "Alerts & Notifications"}</h1>
                    </div>
                    <Link to="/dashboard/provider/">
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
                            style={{ background: "#0e2c38", border: "1px solid #ccc", padding: "4px 6px", borderRadius: "4px", fontSize: "16px", color: "#fff", cursor: "pointer", borderColor: "#1568bb" }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/provider/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="Settings" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">{t('dashboard.settings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>

            <div className="provider-alerts-container" style={{ padding: "2rem" }}>
                <h2 className="alerts-header">{t("providerAlerts.subtitle") || "Recent Farm Alerts"}</h2>
                <div className="alerts-grid">
                    {dummyAlerts.map((alert, idx) => (
                        <div key={idx} className={`alert-card ${alert.severity}`}>
                            <div className="alert-header">
                                <span className="alert-category">{alert.category}</span>
                                <span className="alert-location">📍 {alert.location}</span>
                            </div>
                            <p className="alert-message">{alert.message}</p>
                            <span className="alert-timestamp">{alert.timestamp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProviderAlerts;
