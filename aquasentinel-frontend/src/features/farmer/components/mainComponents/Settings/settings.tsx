import { Link } from 'react-router-dom';
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Settings: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout}) => {
    
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
            <div className="page-title">
                        <Link to="/dashboard/farmer/farmer-profile"><img src="../../public/fast-backward.png" className="back-icon" alt="back" /></Link>
                        <h1>Settings</h1>
                        <Link to="/dashboard/farmer"><img src="../../public/fast-forward.png" alt="forward" /></Link>
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
