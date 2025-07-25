// src/features/provider/components/ProviderExportCenter.tsx
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const ProviderExportCenter: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/recommendations">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text">
                        <h1>{t("providerExportCenter.title") || "Export Center"}</h1>
                    </div>
                    <Link to="/dashboard/provider/alerts">
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

            <div className="dashboard-content-container" style={{ padding: "2rem" }}>
                <div className="export-container" style={{ padding: "2rem" }}>
                    <h2>{t("providerExportCenter.subtitle") || "Download Farm Reports"}</h2>
                    <p>{t("providerExportCenter.description") || "Export irrigation sessions or summaries for offline use."}</p>

                    <div className="export-options">
                        <button className="btn-export">📄 Export All Sessions (CSV)</button>
                        <button className="btn-export">📊 Export Summary Stats (PDF)</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderExportCenter;
