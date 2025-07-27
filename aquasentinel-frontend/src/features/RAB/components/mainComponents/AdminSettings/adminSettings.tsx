import { Link } from "react-router-dom";
// import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const AdminSettings: React.FC<NavBarProps> = ({ sidebarOpen }) => {
    const { t } = useTranslation();

    const [defaultLang, setDefaultLang] = useState("en");
    const [timezone, setTimezone] = useState("Africa/Kigali");
    const [theme, setTheme] = useState("dark");
    const [exportFormat, setExportFormat] = useState("PDF");
    const [dataRetention, setDataRetention] = useState("90");
    // const [notifications, setNotifications] = useState({
    //     lowMoisture: true,
    //     pumpFailure: true,
    //     offlineDevices: true,
    // });
    // const [security, setSecurity] = useState({
    //     twoFA: true,
    //     passwordExpiry: false,
    // });



    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/admin/">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text">
                        <h1>{t("admin.settings") || "Admin Settings"}</h1>
                    </div>
                </div>
            </div>

            <div className="admin-settings-container">
                <h2>🧩 Platform Management</h2>
                <div className="settings-section">
                    <label>Default Language</label>
                    <select value={defaultLang} onChange={e => setDefaultLang(e.target.value)}>
                        <option value="en">English</option>
                        <option value="rw">Kinyarwanda</option>
                    </select>

                    <label>Timezone</label>
                    <input type="text" value={timezone} onChange={e => setTimezone(e.target.value)} />

                    <label>Theme</label>
                    <select value={theme} onChange={e => setTheme(e.target.value)}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>

                <h2>📊 Data & Analytics</h2>
                <div className="settings-section">
                    <label>Export Format</label>
                    <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
                        <option value="CSV">CSV</option>
                        <option value="PDF">PDF</option>
                        <option value="JSON">JSON</option>
                    </select>

                    <label>Data Retention (days)</label>
                    <input type="number" value={dataRetention} onChange={e => setDataRetention(e.target.value)} />
                </div>

                <h2>🔔 Notifications</h2>
                {/* <div className="settings-section">
                    {Object.entries(notifications).map(([key, value]) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => toggle(notifications, setNotifications, key)}
                            /> Enable {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                    ))}
                </div> */}

                <h2>🔐 Security Settings</h2>
                {/* <div className="settings-section">
                    {Object.entries(security).map(([key, value]) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => toggle(security, setSecurity, key)}
                            /> {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default AdminSettings;
