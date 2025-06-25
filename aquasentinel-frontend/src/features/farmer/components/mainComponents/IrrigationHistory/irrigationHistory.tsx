import { Link } from "react-router-dom";
import irrigationHistoryData from "./irrigationData";
import completeIcon from "/public/complete-icon.png";
import warningIcon from "/public/warning-icon.png";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const IrrigationHistory: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const  irrigationdata = irrigationHistoryData
    const getStatusIcon = (status: string) => {
        if (status === "Completed") {
            return completeIcon;
        } else {
            return warningIcon;
        }
    }
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
            <div className="page-title">
                        <Link to="/dashboard/farmer"><img src="../../public/fast-backward.png" className="back-icon" alt="back" /></Link>
                        <h1>Irrigation History</h1>
                        <Link to="/dashboard/farmer/smart-recommendations"><img src="../../public/fast-forward.png" alt="forward" /></Link>
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
            <div className="irrigation-history-container">
                <div className="irrigation-history-cards">
                        <div className="irrigation-history-card">
                            <h3>Total Water Used</h3>
                            <p>1,250 <span>L</span></p>
                        </div>
                        <div className="irrigation-history-card">
                            <h3>Avg Duration of Irrigation(per Day)</h3>
                            <p>40<span>mins</span></p>
                        </div>
                        
                        <div className="irrigation-history-card">
                            <h3>Efficiency Trend</h3>
                            <p>5 <span>%</span></p>
                        </div>
                </div>
                <div className="irrigation-history-wrapper">
                    <div className="irrigation-history-scroll">
                        <table className="irrigation-history-table">
                            <thead>
                                <tr>
                                    <th className="date-header">Date</th>
                                    <th className="start-time-header">Start Time</th>
                                    <th className="end-time-header">End Time</th>
                                    <th className="duration-header">Duration(mins)</th>
                                    <th className="water-used-header">Water Used</th>
                                    <th className="status-header">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {irrigationdata.map((irrigation, index) => (
                                    <tr key={index}>
                                        <td>{irrigation.date}</td>
                                        <td>{irrigation.startTime}</td>
                                        <td>{irrigation.endTime}</td>
                                        <td>{irrigation.duration}</td>
                                        <td>{irrigation.waterUsed}</td>
                                        <td className="status-cell"> 
                                            <img src={getStatusIcon(irrigation.status)} alt={irrigation.status} className="status-icon" />
                                            <span>{irrigation.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                </div>
            </div>
        </div>

    );
}
