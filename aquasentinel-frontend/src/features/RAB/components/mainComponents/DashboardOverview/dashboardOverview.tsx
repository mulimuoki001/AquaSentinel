import { Link } from "react-router-dom";


import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <div className="page-title-tex"> <h1>{t('rab.nationalOverview')}</h1></div>
                    <Link to="/dashboard/RAB/district-zone-monitoring"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
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
                                fontSize: "16px",
                                color: "#fff",
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
                        <Link to="/dashboard/RAB/admin-settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/RAB/admin-settings">{t('rab.adminSettings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>
            <div className="dashboard-overview-container">
                <div className="overview-grid">
                    <div className="overview-card">
                        <h3>{t('rabDashboard.totalUsers')}</h3>
                        <p>1,250</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.irrigatedLand')}</h3>
                        <p>7,400 ha</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.districtsCovered')}</h3>
                        <p>23 districts</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.avgEfficiency')}</h3>
                        <p>73%</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.subsidyImpact')}</h3>
                        <p>{t('rabDashboard.subsidyNote')}</p>
                    </div>
                </div>
            </div>

        </div >
    );
}

