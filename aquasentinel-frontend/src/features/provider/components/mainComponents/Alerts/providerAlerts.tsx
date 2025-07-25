// src/features/provider/components/ProviderAlerts.tsx
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const ProviderAlerts: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();

    const dummyAlerts = [
        { message: "Farm A: Low water flow detected", timestamp: "2025-07-22 14:21", severity: "warning" },
        { message: "Farm B: Soil moisture critically low", timestamp: "2025-07-22 09:40", severity: "danger" },
    ];

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/export-center">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text">
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
                        <a className="settings-link" href="/dashboard/provider/settings">{t('dashboard.settings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>

            <div className="provider-alerts-container" style={{ padding: "2rem" }}>
                <div className="alerts-container">
                    <h2>{t("providerAlerts.subtitle") || "Recent Farm Alerts"}</h2>
                    <ul className="alerts-list">
                        {dummyAlerts.map((alert, idx) => (
                            <li key={idx} className={`alert-${alert.severity}`}>
                                <strong>{alert.timestamp}</strong> - {alert.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProviderAlerts;
