import { Link } from "react-router-dom";
import useFarmerData from "../../../hooks/farmerData";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Profile: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { data, error } = useFarmerData();
    console.log("farmer data:", data);
    ;

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/support-education"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <h1>Profile</h1>
                    <Link to="/dashboard/farmer/settings"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile"><img className="profile-icon" src="../../profile-pic.png" alt="Logout" />

                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="Logout" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">Settings</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
            <div className="profile-container">
                {/* Personal Details */}
                <div className="profile-card">
                    <div className="profile-header">
                        <img src="/profile-pic.png" alt="Profile" className="profile-avatar" />
                        <div className="profile-info">
                            <h3>{data?.name}</h3>
                            <p>Phone Number: {data?.farmphone}</p>
                            <p>Email Address: {data?.email}</p>
                        </div>
                    </div>
                    <button className="edit-button">Edit</button>
                </div>

                {/* Farm Details */}
                <div className="profile-card">
                    <div className="profile-info">
                        <h3>Farm Details</h3>
                        <p><strong>Farm Name:</strong>{data?.farmname}</p>
                        <p><strong>Location:</strong> {data?.farmlocation}</p>
                    </div>
                    <button className="edit-button">Edit</button>
                </div>
            </div>
        </div>

    );
}
