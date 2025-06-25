import { Link } from "react-router-dom";

interface Notification {
    id: number;
    title: string;
    timestamp: string;
    read: boolean;
  }
  
  const mockNotifications: Notification[] = [
    { id: 1, title: "Pump started at 7.15 AM", timestamp: "Today 08:12 AM", read: false },
    { id: 2, title: "Pump started at 7.15 AM", timestamp: "Today 08:12 AM", read: false },
    { id: 3, title: "Pump started at 7.15 AM", timestamp: "Today 08:12 AM", read: false },
  ];
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Notifications: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout}) => {
    
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
            <div className="page-title">
                        <Link to="/dashboard/farmer/export-logs"><img src="../../public/fast-backward.png" alt="back" className="back-icon"/></Link>
                        <h1>Notifications</h1>
                        <Link to="/dashboard/farmer/support-education"><img src="../../public/fast-forward.png" alt="forward" /></Link>
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
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <button className="clear-all">Clear All</button>
                </div>
                <div className="notifications-list">
                    {mockNotifications.map((notification) => (
                        <div key={notification.id} className={`notification-card ${notification.read ? "read" : "unread"}`}>
                            <div className="notification-content">
                                <strong>{notification.title}</strong>
                                <small>{notification.timestamp}</small>
                            </div>
                            <button className="mark-read">Mark as read</button>
                        </div>
                    ))}
                </div>

            </div>
        </div>

    );
}
