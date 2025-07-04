import { Link } from "react-router-dom";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const SmartRecommendations: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const recommendations = [
        {
            id: 1,
            title: "Rain Expected Tomorrow",
            description: "Reduce irrigation today by 25% to avoid overwatering",
        },
        {
            id: 2,
            title: "Try Morning Irrigation",
            description: "Reduces evaporation and Water Loss",
        },
        {
            id: 3,
            title: "Try Morning Irrigation",
            description: "Reduces evaporation and Water Loss",
        },
    ]
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
                        <Link to="/dashboard/farmer/farmer-profile"><img className="profile-icon" src="../../profile-pic.png" alt="" />

                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
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
                    {recommendations.map((recommendation, index) => (
                        <div key={index} className="recommendation">
                            <h2>{recommendation.id}  {recommendation.title}</h2>
                            <p>{recommendation.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
