import { Link } from "react-router-dom";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Profile: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout}) => {
    
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
            <div className="page-title">
                        <Link to="/dashboard/farmer/support-education"><img src="../../public/fast-backward.png" className="back-icon" alt="back" /></Link>
                        <h1>Profile</h1>
                        <Link to="/dashboard/farmer/settings"><img src="../../public/fast-forward.png" alt="forward" /></Link>
                    </div>
                    <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile"><img className="profile-icon" src="../../public/profile-pic.png" alt="Logout" />
                        
                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                        </div>
                        <div className="header-settings">
                            <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../public/settings.png" alt="Logout" />
                        </Link>
                        <a className="settings-link" href="/dashbaord/farmer/settings">Settings</a>
                        </div>
                        <div className="header-logout">
                            <img className="logout-icon"  src="../../public/logout.png" alt="Logout" onClick={handleLogout}/>
                            <a className="logout-link"  onClick={handleLogout}>Logout</a>
                        </div>
                    </div>
            </div>
            <div className="profile-container">
               {/* Personal Details */}
                <div className="profile-card">
                    <div className="profile-header">
                    <img src="/public/profile-pic.png" alt="Profile" className="profile-avatar" />
                    <div className="profile-info">
                        <h3>Brian Muli</h3>
                        <p>Phone Number: +250 7 12xx xxx</p>
                        <p>Email Address: mulimwoki100@gmail.com</p>
                    </div>
                    </div>
                    <button className="edit-button">Edit</button>
                </div>

                {/* Farm Details */}
                <div className="profile-card">
                    <div className="profile-info">
                    <h3>Farm Details</h3>
                    <p><strong>Farm Name:</strong> Nyanza Hills Farm</p>
                    <p><strong>Location:</strong> Kayonza, Rwanda</p>
                    <p><strong>Irrigation Start Date:</strong> 2025-06-20</p>
                    </div>
                    <button className="edit-button">Edit</button>
                </div>
            </div>
        </div>

    );
}
