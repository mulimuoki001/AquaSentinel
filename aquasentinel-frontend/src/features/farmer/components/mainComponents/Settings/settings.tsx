import { Link } from 'react-router-dom';
import useGlobalContext from '../../../../context/useGlobalContext';
import { useTranslation } from 'react-i18next';
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Settings: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <div className="page-title-text"> <h1>{t('dashboard.settings')}</h1></div>                </div>
                <div className="header-nav">
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
                                background: " #0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "16px",
                                cursor: "pointer",
                                borderBlockColor: " #1568bb",
                                borderColor: " #1568bb"
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">{t("dashboard.settings")}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t("dashboard.logout")}</a>
                    </div>
                </div>
            </div>
            <div className="settings-container">
                {/* Top Settings Grid */}
                <div className="settings-grid">
                    <div className="settings-box">
                        <h3>General Settings</h3>
                        <div className="setting-item">
                            <span>Auto-Sync Interval</span>
                            <button className="setting-pill">10mins</button>
                        </div>
                        <div className="setting-item">
                            <span>Offline-mode</span>
                            <label className="switch"><input type="checkbox" /><span className="slider" /></label>
                        </div>
                        <div className="setting-item">
                            <span>Data Export Default</span>
                            <div className="setting-pills">
                                <button className="setting-pill selected">CSV</button>
                                <button className="setting-pill">PDF</button>
                            </div>
                        </div>
                    </div>

                    <div className="settings-box">
                        <h3>Notification Settings</h3>
                        <div className="setting-item">
                            <span>SMS Alerts</span>
                            <label className="switch"><input type="checkbox" checked /><span className="slider" /></label>
                        </div>
                        <div className="setting-item">
                            <span>Dashboard Notifications</span>
                            <label className="switch"><input type="checkbox" checked /><span className="slider" /></label>
                        </div>
                        <div className="setting-item">
                            <span>Email Alerts</span>
                            <label className="switch"><input type="checkbox" /><span className="slider" /></label>
                        </div>
                        <div className="setting-item">
                            <span>Alert Frequency</span>
                            <span className="setting-pill">Real-Time</span>
                        </div>
                    </div>
                </div>

                {/* System Preferences */}
                <div className="preferences-box">
                    <h3>System Preferences</h3>
                    <button className="pref-button">Reset all Settings</button>
                    <button className="pref-button">Sync Now</button>
                    <button className="pref-button">Test Internet Connectivity</button>
                </div>
            </div>
        </div>

    );
}
