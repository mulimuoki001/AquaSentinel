import { Link } from "react-router-dom";
import useIrrigationSessions from "./irrigationData";
import completeIcon from "/complete-icon.png";
import warningIcon from "/warning-icon.png";
import InProgressIcon from "/in-progress.png";
import useTotalWaterUsedDaily from "../../../hooks/totalWaterUsedDaily";
import useFarmerData from "../../../hooks/farmerData";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const IrrigationHistory: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const farmerData = useFarmerData();
    const userId = farmerData.data?.id;
    const irrigationdata = useIrrigationSessions(userId);
    const { totalWaterUsed } = useTotalWaterUsedDaily(userId);
    const totalLiters = totalWaterUsed[0]?.total_water_used || 0;
    const avgTimePerIrrigation = totalWaterUsed[0]?.avg?.toFixed(0) || 0;
    const totalSessions = irrigationdata.sessions.length;
    const completedSessions = irrigationdata.sessions.filter(s => s.status === "Completed").length;


    const efficiencyRate = totalSessions > 0
        ? ((completedSessions / totalSessions) * 100).toFixed(1)
        : "0";
    let efficiencyColorClass = "";
    if (Number(efficiencyRate) > 0 && Number(efficiencyRate) <= 50) {
        efficiencyColorClass = "text-red";
    } else if (Number(efficiencyRate) > 50 && Number(efficiencyRate) <= 75) {
        efficiencyColorClass = "text-yellow";
    } else {
        efficiencyColorClass = "text-green";
    }

    const getStatusIcon = (status: string) => {
        if (status === "Completed") {
            return completeIcon;
        } else if (status === "Low flow") {
            return warningIcon;
        } else {
            return InProgressIcon;
        }
    }



    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <h1>Irrigation History</h1>
                    <Link to="/dashboard/farmer/smart-recommendations"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile"><img src={farmerData.data?.profile_pic ? `/uploads/${encodeURIComponent(farmerData.data.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />

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
            <div className="irrigation-history-container">
                <div className="irrigation-history-cards">
                    <div className="irrigation-history-card">
                        <h3>Total Water Used Today</h3>
                        <p className="irrigation-history-cardp">{totalLiters} <span>L</span></p>
                    </div>
                    <div className="irrigation-history-card">
                        <h3>Avg Duration of Irrigation(per Day)</h3>
                        <p className="irrigation-history-cardp">{avgTimePerIrrigation} <span>mins</span></p>
                    </div>

                    <div className="irrigation-history-card">
                        <h3>Efficiency Trend</h3>
                        <p className={efficiencyColorClass}>{efficiencyRate} <span>%</span></p>
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
                                    <th className="water-used-header">Water Used(L)</th>
                                    <th className="status-header">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {irrigationdata.sessions.map((irrigation, index) => (
                                    <tr key={index}>
                                        <td>{irrigation.date}</td>
                                        <td>{irrigation.start_time}</td>
                                        <td>{irrigation.end_time}</td>
                                        <td>{irrigation.duration}</td>
                                        <td>{irrigation.total_liters}</td>
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
