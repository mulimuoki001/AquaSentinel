import { Link } from "react-router-dom";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout}) => {
    
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                    <div className="page-title">
                        <h1>Dashboard Overview</h1>
                        <Link to="/dashboard/farmer/irrigation-history"><img src="../public/fast-forward.png" alt="forward" /></Link>
                    </div>
                    <div className="header-nav">
                        <div className="header-profile">
                            <Link to="/dashboard/farmer/farmer-profile"><img className="profile-icon" src="../public/profile-pic.png" alt="Logout" />
                            
                            </Link>
                            <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                        </div>
                        <div className="header-settings">
                            <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../public/settings.png" alt="Logout" />
                        </Link>
                        <a className="settings-link" href="/dashbaord/farmer/settings">Settings</a>
                        </div>
                        <div className="header-logout">
                            <img className="logout-icon"  src="../public/logout.png" alt="Logout" onClick={handleLogout}/>
                            <a className="logout-link"  onClick={handleLogout}>Logout</a>
                        </div>
                    </div>
            </div>
            <div className="dashboard-overview-container">

                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Total Water Used</h3>
                        <p>1,250 <span>L</span></p>
                    </div>
                    <div className="card">
                        <h3>Avg Soil Moisture</h3>
                        <p>70<span>%</span></p>
                    </div>
                    
                    <div className="card">
                        <h3>Pump Runtime</h3>
                        <p>5 <span>hrs</span></p>
                    </div>
                    <div className="dashboard-cards2">
                        <div className="water-usage">
                            <div className="water-usage-title"><h3>Water Usage Last 5hrs</h3></div>
                            <div className="water-usage-graph"><h3>Water Usage Bar Graph</h3></div>
                        </div>
                        <div className="pump-rate">
                            <div className="pump-rate-title"><h3>Pump Rate</h3></div>
                            <div className="pump-rate-graph"><h3>Pump Rate Graph</h3></div>
                        </div>
                        
                        <div className="pump-status">
                            <h3 className="pump-status-title">Pump Status</h3>
                            <div className="pump-status-current"><div className="pump-status-on"><h1>ON</h1></div></div>
                        </div>
                    </div>
                    <div className="dashboard-cards3">
                        <div className="water-usage">
                            <div className="water-usage-line-graph"><h3>Water Usage Line Graph</h3></div>
                        </div>
                        <div className="dashboard-alerts">
                            <div className="alerts-title"><h3>Alerts</h3></div>
                            <div className="alerts">
                                <div className="alert"><h3>Alert 1</h3></div>
                                <div className="alert"><h3>Alert 1</h3></div>
                                <div className="alert"><h3>Alert 1</h3></div>
                                <div className="alert"><h3>Alert 1</h3></div>
                                <div className="alert"><h3>Alert 1</h3></div>
                            </div>
                        </div>
                </div>
            </div>
            </div>
        </div>
    );
}
