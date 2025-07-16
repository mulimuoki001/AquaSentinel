import { Link } from "react-router-dom";
import useIrrigationSessions from "./irrigationData";
import completeIcon from "/complete-icon.png";
import warningIcon from "/warning-icon.png";
import InProgressIcon from "/in-progress.png";
import useGlobalContext from "../../../../context/useGlobalContext";
import useTotalWaterUsedDaily from "../../../hooks/totalWaterUsedDaily";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";


interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const IrrigationHistory: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { userData } = useGlobalContext();
    const userId = userData?.id;
    const [showHelp, setShowHelp] = useState<"water" | "duration" | "efficiency" | null>(null);
    const irrigationdata = useIrrigationSessions(userId);
    const { totalWaterUsed } = useTotalWaterUsedDaily(userId);
    const totalLiters = totalWaterUsed[0]?.total_water_used || 0;
    const avgTimePerIrrigation = totalWaterUsed[0]?.avg?.toFixed(0) || 0;
    const totalSessions = irrigationdata.sessions.length;
    const completedSessions = irrigationdata.sessions.filter(s => s.status === "Completed").length;

    const [currentPage, setCurrentPage] = useState(1);

    const [liveDuration, setLiveDuration] = useState<number>(0);



    const rowsPerPage = 5;

    const totalPages = Math.ceil(irrigationdata.sessions.length / rowsPerPage);
    const paginatedSessions = irrigationdata.sessions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const efficiencyRate = totalSessions > 0
        ? ((completedSessions / totalSessions) * 100).toFixed(1)
        : "0";
    let efficiencyColorClass = "";
    if (Number(efficiencyRate) > 0.0 && Number(efficiencyRate) <= 50.0) {
        efficiencyColorClass = "text-red";
    } else if (Number(efficiencyRate) > 50.0 && Number(efficiencyRate) <= 75.0) {
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
    useEffect(() => {
        const inProgressSession = irrigationdata.sessions.find(s => s.status === "In Progress");

        if (inProgressSession) {
            const start = DateTime.fromFormat(
                `${inProgressSession.date} ${inProgressSession.start_time}`,
                "yyyy-MM-dd HH:mm:ss"
            );

            const updateDuration = () => {
                const now = DateTime.now();
                const diff = now.diff(start, "minutes").minutes;
                setLiveDuration(parseFloat(diff.toFixed(2)));
            };

            updateDuration(); // initial run
            const interval = setInterval(updateDuration, 1000); // update every second

            return () => clearInterval(interval);
        } else {
            setLiveDuration(0);
        }
    }, [irrigationdata.sessions]);


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
                        <Link to="/dashboard/farmer/farmer-profile"><img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />

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
                    <div className={`irrigation-history-card ${showHelp === "water" ? "expanded" : ""}`}>

                        <h3>Total Water Used Today</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "water" ? null : "water"))}
                        />

                        <p className="irrigation-history-cardp">{totalLiters} <span>L</span></p>

                        {showHelp === "water" && (
                            <div className="popup-card">
                                This shows the total water used in irrigation sessions recorded today. It’s based on real-time flow rate data.
                            </div>
                        )}
                    </div>
                    <div className={`irrigation-history-card ${showHelp === "duration" ? "expanded" : ""}`}>
                        <h3>Avg Duration of Irrigation(per Day)</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "duration" ? null : "duration"))}
                        />

                        <p className="irrigation-history-cardp">{avgTimePerIrrigation} <span>mins</span></p>

                        {showHelp === "duration" && (
                            <div className="popup-card">
                                This shows the average duration of irrigation sessions recorded today. It’s based on real-time flow rate data.
                            </div>
                        )}

                    </div>

                    <div className={`irrigation-history-card ${showHelp === "efficiency" ? "expanded" : ""}`}>
                        <h3>Efficiency Trend</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "efficiency" ? null : "efficiency"))}
                        />

                        <p className={efficiencyColorClass}>{efficiencyRate} <span>%</span></p>

                        {showHelp === "efficiency" && (
                            <div className="popup-card">
                                <p>This shows the average efficiency of irrigation sessions recorded today.</p>
                                <span>
                                    <strong>Efficiency Guide:</strong><br />
                                    🟢 <strong>75-100%</strong>: High Efficiency – Optimal water usage.<br />
                                    🟡 <strong>50–74%</strong>: Medium Efficiency – Monitor closely.<br />
                                    🔴 <strong>Below 50%</strong>: Low Efficiency – Possible over-irrigation, underflow, or system faults.
                                </span>
                            </div>
                        )}

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
                                {paginatedSessions.map((irrigation, index) => (
                                    <tr key={index}>
                                        <td>{irrigation.date}</td>
                                        <td>{irrigation.start_time}</td>
                                        <td>{irrigation.end_time}</td>
                                        <td>{irrigation.status === "In Progress" ? (
                                            <span style={{ color: "yellow", fontWeight: "bold" }}>
                                                {liveDuration.toFixed(2)}
                                            </span>
                                        ) : (
                                            irrigation.duration
                                        )}</td>
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
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

            </div>
        </div >

    );
}
