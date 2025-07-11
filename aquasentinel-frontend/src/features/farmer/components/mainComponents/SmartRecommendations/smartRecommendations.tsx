import { Link } from "react-router-dom";
import { useWeatherRecommendations } from "../../../hooks/useWeatherRecommendations";
import { useGlobalContext } from "../../../../context/GlobalAppContext";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}

export const SmartRecommendations: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const recommendations = useWeatherRecommendations();
    const { userData } = useGlobalContext();

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/irrigation-history"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <h1>Smart Recommendations</h1>
                    <Link to="/dashboard/farmer/export-logs"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile">
                            <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />
                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" /></Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">Settings</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
            <div className="smart-recommendations-container">
                <div className="smart-recommendations">
                    {recommendations.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#ccc" }}>No new recommendations today</p>
                    ) : (
                        recommendations.map((rec) => (
                            <div className="recommendation" key={rec.message}>
                                <p>{rec.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
