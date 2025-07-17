import { Link } from "react-router-dom";
import useIrrigationSessions from "./irrigationData";
import completeIcon from "/complete-icon.png";
import warningIcon from "/warning-icon.png";
import InProgressIcon from "/in-progress.png";
import useGlobalContext from "../../../../context/useGlobalContext";
import useTotalWaterUsedDaily from "../../../hooks/totalWaterUsedDaily";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const IrrigationHistory: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { userData, currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
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
                    <div className="page-title-text-irrigation">  <h1>{t("irrigation.title")}</h1></div>
                    <Link to="/dashboard/farmer/smart-recommendations"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-language">
                        <label htmlFor="lang-select" className="profile-link" style={{ marginRight: "8px" }}>
                            🌐
                        </label>
                        <select
                            id="lang-select"
                            value={currentLang}
                            onChange={(e) => setLang(e.target.value)}
                            className="profile-link"
                            style={{
                                background: " #0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "16px",
                                cursor: "pointer",
                                borderBlockColor: " #1568bb",
                                borderColor: " #1568bb"
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">{t("dashboard.settings")}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t("dashboard.logout")}</a>
                    </div>
                </div>
            </div>
            <div className="irrigation-history-container">
                <div className="irrigation-history-cards">
                    <div className={`irrigation-history-card ${showHelp === "water" ? "expanded" : ""}`}>

                        <h3>T{t("irrigation.totalWaterUsed")}</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "water" ? null : "water"))}
                        />

                        <p className="irrigation-history-cardp">{totalLiters} <span>L</span></p>

                        {showHelp === "water" && (
                            <div className="popup-card">
                                {t("irrigation.help.water")}
                            </div>
                        )}
                    </div>
                    <div className={`irrigation-history-card ${showHelp === "duration" ? "expanded" : ""}`}>
                        <h3>T{t("irrigation.avgDuration")}</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "duration" ? null : "duration"))}
                        />

                        <p className="irrigation-history-cardp">{avgTimePerIrrigation} <span>mins</span></p>

                        {showHelp === "duration" && (
                            <div className="popup-card">
                                {t("irrigation.help.duration")}
                            </div>
                        )}

                    </div>

                    <div className={`irrigation-history-card ${showHelp === "efficiency" ? "expanded" : ""}`}>
                        <h3>{t("irrigation.efficiency")}</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "efficiency" ? null : "efficiency"))}
                        />

                        <p className={efficiencyColorClass}>{efficiencyRate} <span>%</span></p>

                        {showHelp === "efficiency" && (
                            <div className="popup-card">
                                <p>{t("irrigation.help.efficiency.desc")}</p>
                                <span>
                                    <strong>{t("irrigation.help.efficiency.guideTitle")}</strong><br />
                                    🟢 <strong>{t('irrigation.help.efficiency.high')}</strong>: {t('irrigation.help.efficiency.highDesc')}<br />
                                    🟡 <strong>{t('irrigation.help.efficiency.medium')}</strong>:  {t('irrigation.help.efficiency.mediumDesc')}<br />
                                    🔴 <strong>{t('irrigation.help.efficiency.low')}</strong>:  {t('irrigation.help.efficiency.lowDesc')}
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
                                    <th className="date-header">{t("irrigation.table.date")}</th>
                                    <th className="start-time-header">{t("irrigation.table.startTime")}</th>
                                    <th className="end-time-header">{t("irrigation.table.endTime")}</th>
                                    <th className="duration-header">{t("irrigation.table.duration")}</th>
                                    <th className="water-used-header">{t("irrigation.table.waterUsed")}</th>
                                    <th className="status-header">{t("irrigation.table.status")}</th>
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
                        {t("pagination.prev")}
                    </button>
                    <span>{t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        {t("pagination.next")}
                    </button>
                </div>

            </div>
        </div >

    );
}
