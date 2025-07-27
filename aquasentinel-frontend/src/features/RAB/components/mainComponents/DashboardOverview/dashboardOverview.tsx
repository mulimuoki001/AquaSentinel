import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {

    ArcElement,

} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import mockCompliance from "../ComplianceReports/mockComplianceReportsData";
import DistrictZoneMap from "../DistrictZoneMonitoring/districtZoneMap";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    const zoneLabels = [...new Set(mockCompliance.map(f => f.zone))];
    const avgEffByZone = zoneLabels.map(label => {
        const zoneFarms = mockCompliance.filter(f => f.zone === label);
        const totalEff = zoneFarms.reduce((sum, f) => sum + f.avgEfficiency, 0);
        return (totalEff / zoneFarms.length).toFixed(1);

    });
    const totalFarmsByZone = zoneLabels.map(label => {
        const zoneFarms = mockCompliance.filter(f => f.zone === label).length;
        const totalFarms = mockCompliance.length;
        return ((zoneFarms / totalFarms) * 100).toFixed(0);
    });
    const ChartData1 = {
        labels: zoneLabels,
        datasets: [
            {
                label: "Total Farms by Zone",
                data: totalFarmsByZone.map(value => parseFloat(value)), // Convert string to number
                backgroundColor: totalFarmsByZone.map(value => {
                    const numValue = parseFloat(value); // Convert value to a number
                    if (numValue >= 5) return "#4caf50";   // High: Green
                    return "#f44336";                    // Low: Red
                }),
            },
        ],
    };
    const chartData = {
        labels: zoneLabels,
        datasets: [
            {
                label: "Avg Efficiency (%)",
                data: avgEffByZone.map(value => parseFloat(value)), // Convert string to number
                backgroundColor: avgEffByZone.map(value => {
                    const numValue = parseFloat(value); // Convert value to a number
                    if (numValue >= 80) return "#4caf50";   // High: Green
                    if (numValue >= 60) return "#ffc107";   // Medium: Yellow
                    return "#f44336";                    // Low: Red
                }),

            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: "#ffffff" // Legend label color
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#ffffff" // X-axis tick label color
                }
            },
            y: {
                ticks: {
                    color: "#ffffff" // Y-axis tick label color
                }
            }
        }
    };
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <div className="page-title-tex"> <h1>{t('rab.nationalOverview')}</h1></div>
                    <Link to="/dashboard/RAB/district-zone-monitoring"><img src="../../fast-forward.png" alt="forward" /></Link>
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
                                fontSize: "16px",
                                color: "#fff",
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
                        <Link to="/dashboard/RAB/admin-settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/RAB/admin-settings">{t('rab.adminSettings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>
            <div className="RAB-dashboard-container">
                <div className="overview-grid">
                    <div className="overview-card">
                        <h3>{t('rabDashboard.totalUsers')}</h3>
                        <p>1,250</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.irrigatedLand')}</h3>
                        <p>7,400 ha</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.districtsCovered')}</h3>
                        <p>23 districts</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.avgEfficiency')}</h3>
                        <p>73%</p>
                    </div>
                    <div className="overview-card">
                        <h3>{t('rabDashboard.complianceRate')}</h3>
                        <div className="compliance-pie">
                            <Pie
                                data={{
                                    labels: ["Compliant", "Non-Compliant"],
                                    datasets: [
                                        {
                                            data: [76, 24], // 76% compliant
                                            backgroundColor: ["#4caf50", "#f44336"],
                                            borderColor: "#0e2c38",
                                            borderWidth: 2,
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: "#fff"
                                            }
                                        }
                                    }
                                }}
                            />
                            <p style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>76% Compliant</p>
                        </div>
                    </div>
                </div>
                <div className="rab-dashboard-charts-grid">
                    <div className="rab-dashboard-chart">
                        <h3>{t('rabDashboard.avgEfficiency')} by Province</h3>
                        <Bar data={chartData} options={chartOptions as any} />
                    </div>
                    <div className="rab-dashboard-chart">
                        <h3>{t('rabDashboard.totalFarms')} </h3>
                        <Bar data={ChartData1} options={chartOptions as any} />
                    </div>

                </div>
                <div className="district-zone-map-grid">
                    <div className="rab-dashboard-map">
                        <DistrictZoneMap />
                    </div>
                </div>
            </div>

        </div >
    );
}

