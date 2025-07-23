import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <div className="page-title-text">
                        <h1>{t('provider.dashboard')}</h1>
                    </div>
                    <Link to="/dashboard/provider/farm-monitoring">
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
                                borderBlockColor: "#1568bb",
                                borderColor: "#1568bb"
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/provider/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">{t('dashboard.settings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>

            <div className="provider-dashboard-container" style={{ padding: "2rem 3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                <div className="provider-dashboard-card highlight-card">
                    <h2>Total Farms</h2>
                    <p>132</p>
                </div>
                <div className="provider-dashboard-card highlight-card">
                    <h2>Water Used Today</h2>
                    <p>6,450 L</p>
                </div>
                <div className="provider-dashboard-card highlight-card">
                    <h2>Avg Irrigation Time</h2>
                    <p>32 mins</p>
                </div>
                <div className="provider-dashboard-card highlight-card">
                    <h2>Active Alerts</h2>
                    <p>5</p>
                </div>

                <div className="dashboard-section" style={{ gridColumn: "span 2", background: "#083d54", color: "white", padding: "1.5rem", borderRadius: "16px" }}>
                    <h3>Farm Insights</h3>
                    <p style={{ marginTop: "0.5rem", lineHeight: 1.6 }}>Real-time analytics on water efficiency, irrigation trends, and regional performance. Compare across farms and identify areas for support.</p>
                </div>
                <div className="dashboard-section" style={{ gridColumn: "span 2", background: "#083d54", color: "white", padding: "1.5rem", borderRadius: "16px" }}>
                    <h3>Recommendations Overview</h3>
                    <p style={{ marginTop: "0.5rem", lineHeight: 1.6 }}>Summary of automated irrigation advice sent to farmers today. Review effectiveness and tailor recommendations for better results.</p>
                </div>
            </div>
        </div>
    );
};
