import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "../CSS/providerSettings.css";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const ProviderSettings: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
    const [notificationPrefs, setNotificationPrefs] = useState({
        moistureAlerts: true,
        pumpStatusAlerts: true,
        efficiencyAlerts: false,
        aiInsights: true,
    });

    const [exportFormat, setExportFormat] = useState("PDF");
    const [viewMode, setViewMode] = useState("map");
    const [offlineSync, setOfflineSync] = useState(false);

    const handleToggle = (key: keyof typeof notificationPrefs) => {
        setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">

                    <div className="page-title-tex">
                        <h1>{t("providerSettings.settings") || "Settings"}</h1>
                    </div>

                </div>
            </div>

            <div className="provider-settings-container">
                <h2>{t("providerSettings.languageSettings") || "Language Preference"}</h2>
                <div className="settings-section">
                    <label htmlFor="lang-select" style={{ color: "#ccc", marginRight: "8px" }}>🌐</label>
                    <select
                        id="lang-select"
                        value={currentLang}
                        onChange={(e) => setLang(e.target.value)}
                        className="profile-link"
                        style={{
                            background: "#0e2c38",
                            border: "1px solid #1568bb",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            fontSize: "16px",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        <option value="en">English</option>
                        <option value="rw">Kinyarwanda</option>
                    </select>
                </div>

                <h2 style={{ marginTop: "2rem" }}>{t("providerSettings.notificationPreferences") || "Notification Preferences"}</h2>
                <div className="settings-section">
                    {Object.entries(notificationPrefs).map(([key, value]) => (
                        <label key={key} style={{ display: "block", margin: "8px 0" }}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => handleToggle(key as keyof typeof notificationPrefs)}
                            /> {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                    ))}
                </div>

                <h2 style={{ marginTop: "2rem" }}>{t("providerSettings.exportFormat") || "Export Preferences"}</h2>
                <div className="settings-section">
                    <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        style={{ background: "#0e2c38", color: "#fff", padding: "6px", borderRadius: "4px" }}
                    >
                        <option value="CSV">CSV</option>
                        <option value="PDF">PDF</option>
                        <option value="JSON">JSON</option>
                    </select>
                </div>

                <h2 style={{ marginTop: "2rem" }}>{t("providerSettings.dashboardViewPreferences") || "View Mode"}</h2>
                <div className="settings-section">
                    <label>
                        <input type="radio" value="table" checked={viewMode === "table"} onChange={() => setViewMode("table")} /> Table View
                    </label>
                    <label style={{ marginLeft: "1rem" }}>
                        <input type="radio" value="map" checked={viewMode === "map"} onChange={() => setViewMode("map")} /> Map View
                    </label>
                </div>



                <h2 style={{ marginTop: "2rem" }}>{t("providerSettings.offlineMode") || "Offline Sync"}</h2>
                <div className="settings-section">
                    <label>
                        <input type="checkbox" checked={offlineSync} onChange={() => setOfflineSync(prev => !prev)} /> {t("providerSettings.enableOfflineSync") || "Enable Offline Sync"}
                    </label>
                </div>

                <h2 style={{ marginTop: "2rem" }}>{t("provider.accountOptions") || "Account Options"}</h2>
                <div className="settings-section">
                    <button className="settings-btn" onClick={() => alert("Password reset coming soon")}>🔐 {t('providerSettings.changePassword')}</button>
                    <button className="settings-btn logout-btn" onClick={handleLogout}>🚪 {t('providerSettings.logout')}</button>
                </div>
            </div>
        </div>
    );
};

export default ProviderSettings;
