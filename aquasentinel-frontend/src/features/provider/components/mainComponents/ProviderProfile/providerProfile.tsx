import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../CSS/providerProfile.css";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const ProviderProfile: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { userData, currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">

                    <div className="page-title-tex">
                        <h1>{t("providerProfile.profile") || "Profile"}</h1>
                    </div>

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

            <div className="provider-profile-container1">  <div className="provider-profile-container">
                <h2>{t("providerProfile.profileSettings") || "Profile Details"}</h2>
                <div className="settings-section">
                    <p><strong>{t("providerProfile.name") || "Name"}:</strong> {userData?.name || "John Doe"}</p>
                    <p><strong>{t("providerProfile.email") || "Email"}:</strong> {userData?.email || "provider@example.com"}</p>
                </div>
            </div>

            </div>
        </div>
    );
};

export default ProviderProfile;
