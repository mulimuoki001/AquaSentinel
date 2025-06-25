import { Link } from "react-router-dom";
import CSVIcon from "/public/CSV2.png";
import PDFIcon from "/public/PDF2.png";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const ExportLogs: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout}) => {
    
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                        <Link to="/dashboard/farmer/smart-recommendations"><img src="../../public/fast-backward.png" className="back-icon" alt="back" /></Link>
                        <h1>Export Logs</h1>
                        <Link to="/dashboard/farmer/notifications"><img src="../../public/fast-forward.png" alt="forward" /></Link>
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
            <div className="export-logs-container">
                <div className="export-title">
                    <h1>Export Logs</h1>
                </div>
                <div className="export-buttons">
                    <button className="export-btn csv">
                        <img src={CSVIcon} alt="CSV" className="export-icon"/>
                       <h3>Export CSV</h3>
                    </button>
                    <button className="export-btn pdf">
                        <img src={PDFIcon} alt="PDF" className="export-icon"/>
                        <h3>Export PDF</h3>
                    </button>
            </div>
            </div>
        </div>

    );
}
