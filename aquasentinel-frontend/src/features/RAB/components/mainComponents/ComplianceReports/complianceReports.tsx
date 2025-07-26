import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGlobalContext from "../../../../context/useGlobalContext";
import mockCompliance from "./mockComplianceReportsData";
import exportCSV from "./CSVComplianceReports";
import downloadPDF from "./PDFComplinaceReport";
import { useState } from "react";
import "../CSS/complianceReports.css";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}




export const ComplianceReports: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    const [search, setSearch] = useState("");
    const [zone, setZone] = useState("");

    const [minEfficiency, setMinEfficiency] = useState(0);
    const [minComplianceRate, setMinComplianceRate] = useState(0);
    const filteredData = mockCompliance.filter((row) => {
        const matchesDistrict = row.district.toLowerCase().includes(search.toLowerCase());
        const matchesZone = zone ? row.zone === zone : true;
        const meetsEfficiency = row.avgEfficiency >= minEfficiency;
        const meetsCompliance = (row.compliant / row.farms) * 100 >= minComplianceRate;
        return matchesDistrict && meetsEfficiency && meetsCompliance && matchesZone;
    });

    const uniqueZones = Array.from(new Set(mockCompliance.map((row) => row.zone))).sort();
    const totals = filteredData.reduce(
        (acc, row) => {
            acc.totalFarms += row.farms;
            acc.totalCompliant += row.compliant;
            acc.totalEfficiency += row.avgEfficiency;
            acc.totalWaterUsed += row.waterUsed;
            return acc;
        },
        { totalFarms: 0, totalCompliant: 0, totalEfficiency: 0, totalWaterUsed: 0 }
    );

    const avgEfficiency = (filteredData.length > 0)
        ? (totals.totalEfficiency / filteredData.length).toFixed(1)
        : "0";

    const complianceRate = (totals.totalFarms > 0)
        ? ((totals.totalCompliant / totals.totalFarms) * 100).toFixed(1)
        : "0";

    return (
        <div className="layout">
            {/* Topbar */}
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">

                    <Link to="/dashboard/RAB/alerts">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-tex">
                        <h1>{t("rabCompliance.compliance")}</h1>
                    </div>
                    <Link to="/dashboard/RAB/recommendations-policy-insights">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
                </div>
                <div className="header-nav">
                    {/* Language Switcher */}
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
                                fontSize: "16px",
                                color: "#fff",
                                cursor: "pointer",
                                borderColor: "#1568bb",
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>

                    {/* Admin Settings */}
                    <div className="header-settings">
                        <Link to="/dashboard/RAB/admin-settings">
                            <img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/RAB/admin-settings">
                            {t("rabData.adminSettings")}
                        </a>
                    </div>

                    {/* Logout */}
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>
                            {t("dashboard.logout")}
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="layout">
                <div className="compliance-container">
                    <h1>{t("rabCompliance.complianceTitle")}</h1>
                    <p>{t("rabCompliance.complianceDescription")}</p>

                    <div className="compliance-controls">
                        <select value={search} onChange={(e) => setSearch(e.target.value)} className="dropdown">
                            <option value="">All Districts</option>
                            {mockCompliance.map((row) => (
                                <option key={row.district} value={row.district}>
                                    {row.district}
                                </option>
                            ))}
                        </select>
                        <select value={zone} onChange={(e) => setZone(e.target.value)} className="dropdown">
                            <option value="">All Zones</option>
                            {uniqueZones.map((z) => (
                                <option key={z} value={z}>
                                    {z}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="min-efficiency" className="min-efficiency-label">
                            {t("rabCompliance.minEfficiency")}
                        </label>
                        <input
                            type="number"
                            placeholder="Min Efficiency %"
                            value={minEfficiency}
                            onChange={(e) => setMinEfficiency(Number(e.target.value))}
                        />
                        <label htmlFor="compliance-rate" className="compliance-rate-label">
                            {t("rabCompliance.minComplianceRate")}
                        </label>
                        <input
                            type="number"
                            placeholder="Min Compliance %"
                            value={minComplianceRate}
                            onChange={(e) => setMinComplianceRate(Number(e.target.value))}
                        />
                    </div>

                    <div className="compliance-table-container">
                        <table className="compliance-table">
                            <thead>
                                <tr>
                                    <th>{t("rabCompliance.district")}</th>
                                    <th>{t("rabCompliance.zone")}</th>
                                    <th>{t("rabCompliance.totalFarms")}</th>
                                    <th>{t("rabCompliance.compliantFarms")}</th>
                                    <th>{t("rabCompliance.avgEfficiency")}</th>
                                    <th>{t("rabCompliance.complianceRate")}</th>
                                    <th>{t("rabCompliance.waterUsed")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row) => (
                                    <tr key={row.district}>
                                        <td>{row.district}</td>
                                        <td>{row.zone}</td>
                                        <td>{row.farms}</td>
                                        <td>{row.compliant}</td>
                                        <td>{row.avgEfficiency}</td>
                                        <td>{((row.compliant / row.farms) * 100).toFixed(1)}</td>
                                        <td>{row.waterUsed} </td>
                                    </tr>
                                ))}
                                <tr className="summary-row">
                                    <td><strong>Total</strong></td>
                                    <td>---</td>
                                    <td><strong>{totals.totalFarms}</strong></td>
                                    <td><strong>{totals.totalCompliant}</strong></td>
                                    <td><strong>{avgEfficiency}%</strong></td>
                                    <td><strong>{complianceRate}%</strong></td>
                                    <td><strong>{totals.totalWaterUsed.toLocaleString()} m³</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="export-section">
                        <button className="export-btn" onClick={exportCSV}>Export CSV</button>
                        <button className="export-btn" onClick={downloadPDF}>Download PDF</button>
                    </div>
                </div>
            </div>

        </div>
    );
};
