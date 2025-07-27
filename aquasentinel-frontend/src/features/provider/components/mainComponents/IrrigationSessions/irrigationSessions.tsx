import { Link } from "react-router-dom";
import useAllPumpSessions from "./farmersSessions";
import completeIcon from "/complete-icon.png";
import warningIcon from "/warning-icon.png";
import inProgressIcon from "/in-progress.png";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useState } from "react";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

export const ProviderIrrigationSessions: React.FC<NavBarProps> = ({
    sidebarOpen,
    handleLogout,
}) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const { sessions, loading, error } = useAllPumpSessions();

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const filteredSessions = sessions.filter(session =>
        statusFilter === "All" || session.status === statusFilter
    );
    const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    const completedSessions = sessions.filter(s => s.status === "Completed").length;
    const efficiencyRate = sessions.length > 0
        ? ((completedSessions / sessions.length) * 100).toFixed(1)
        : "0";

    let efficiencyColorClass = "";
    if (Number(efficiencyRate) <= 50) efficiencyColorClass = "text-red";
    else if (Number(efficiencyRate) <= 75) efficiencyColorClass = "text-yellow";
    else efficiencyColorClass = "text-green";

    const getStatusIcon = (status: string) => {
        if (status === "Completed") return completeIcon;
        if (status === "Low flow") return warningIcon;
        return inProgressIcon;
    };

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/farm-monitoring">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-text-irrigation">
                        <h1>{t("provider.IrrigationSessions")}</h1>
                    </div>
                    <Link to="/dashboard/provider/recommendations">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
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
                                background: "#0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "16px",
                                cursor: "pointer",
                                borderColor: "#1568bb"
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/provider/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">
                            {t("dashboard.settings")}
                        </a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>
                            {t("dashboard.logout")}
                        </a>
                    </div>
                </div>
            </div>

            <div className="irrigation-history-container">
                <div className="irrigation-history-cards">
                    <div className="irrigation-history-card">
                        <h3>{t("irrigation.efficiency")}</h3>
                        <p className={efficiencyColorClass}>{efficiencyRate} <span>%</span></p>
                    </div>
                    <div className="irrigation-history-card">
                        <h3>Total Sessions</h3>
                        <p>{sessions.length}</p>
                    </div>
                    <div className="irrigation-history-card">
                        <h3>Completed</h3>
                        <p>{completedSessions}</p>
                    </div>
                </div>

                <div className="irrigation-history-wrapper">
                    <div className="filter-controls">
                        <label htmlFor="status-filter">Filter by Status:</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1); // Reset to page 1 when filter changes
                            }}
                            style={{
                                marginLeft: "8px",
                                padding: "6px",
                                borderRadius: "6px",
                                backgroundColor: "#0e2c38",
                                color: "#fff",
                                border: "1px solid #1568bb",
                            }}
                        >
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Low flow">Low flow</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>
                    {loading && <p>Loading irrigation sessions...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (

                        <div className="irrigation-history-scroll">
                            <table className="irrigation-history-table">
                                <thead>
                                    <tr>
                                        <th>Farm Name</th>
                                        <th>Owner</th>
                                        <th>Location</th>
                                        <th>{t("irrigation.table.date")}</th>
                                        <th>{t("irrigation.table.startTime")}</th>
                                        <th>{t("irrigation.table.endTime")}</th>
                                        <th>{t("irrigation.table.duration")}</th>
                                        <th>{t("irrigation.table.waterUsed")}</th>
                                        <th>{t("irrigation.table.status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSessions.map((s, idx) => (
                                        <tr key={idx}>
                                            <td>{s.farmname}</td>
                                            <td>{s.farmowner}</td>
                                            <td>{s.farmlocation}</td>
                                            <td>{DateTime.fromISO(s.date).toFormat("dd LLL yyyy")}</td>
                                            <td>{s.start_time}</td>
                                            <td>{s.end_time || "-"}</td>
                                            <td>{s.duration ?? "-"}</td>
                                            <td>{s.total_liters ?? "-"}</td>
                                            <td className="status-cell">
                                                <img src={getStatusIcon(s.status)} alt={s.status} className="status-icon" />
                                                <span>{s.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {t("pagination.prev")}
                    </button>
                    <span>
                        {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        {t("pagination.next")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderIrrigationSessions;