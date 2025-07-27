// DashboardOverview.tsx
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import CellLevelMap from "../FarmMonitoring.ts/farmMap";
import mockFarmsData from "../MockData/mockFarmsData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();

    const totalFarms = mockFarmsData.length;
    const totalWaterUsed = mockFarmsData.reduce((sum, farm) => sum + farm.waterUsedToday, 0);
    const avgIrrigationTime = 60; // Replace with actual data
    const activeAlerts = mockFarmsData.filter(farm => farm.moisture < 25 || farm.pumpStatus === "OFF").length;

    const districtLabels = [...new Set(mockFarmsData.map(f => f.district))];
    const TotalLandCoverage = mockFarmsData.reduce((sum, f) => sum + f.farmSize, 0).toLocaleString();
    const avgEffByDistrict = districtLabels.map(label => {
        const districtFarms = mockFarmsData.filter(f => f.district === label);
        const totalEff = districtFarms.reduce((sum, f) => sum + f.avgEfficiency, 0);
        return (totalEff / districtFarms.length).toFixed(1);
    });
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
                    color: "#ffffff", // ✅ X-axis label color
                    maxRotation: 40,
                    minRotation: 30,
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: "rgba(255,255,255,0.1)" // optional: make gridlines subtle
                }
            },
            y: {
                ticks: {
                    color: "#ffffff", // ✅ Y-axis label color
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: "rgba(255,255,255,0.1)"
                },
                min: 0,
                max: 100
            }
        }
    };

    const chartData = {
        labels: districtLabels,
        datasets: [
            {
                label: "Avg Efficiency (%)",
                data: avgEffByDistrict,
                backgroundColor: avgEffByDistrict.map(value => {
                    const numValue = parseFloat(value); // Convert value to a number
                    if (numValue >= 80) return "#4caf50";   // High: Green
                    if (numValue >= 60) return "#ffc107";   // Medium: Yellow
                    return "#f44336";                    // Low: Red
                }),

            },
        ],
    };


    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <div className="page-title-tex">
                        <h1>{t('provider.dashboard')}</h1>
                    </div>
                    <Link to="/dashboard/provider/farm-monitoring">
                        <img src="../../fast-forward.png" alt="forward" />
                    </Link>
                </div>
                <div className="header-nav">
                    <div className="header-language">
                        <label htmlFor="lang-select" className="profile-link" style={{ marginRight: "8px" }}>🌐</label>
                        <select
                            id="lang-select"
                            value={currentLang}
                            onChange={(e) => setLang(e.target.value)}
                            className="profile-link"
                            style={{ background: "#0e2c38", border: "1px solid #ccc", padding: "4px 6px", borderRadius: "4px", fontSize: "16px", color: "#fff", cursor: "pointer", borderColor: "#1568bb" }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/provider/settings">
                            <img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">{t('dashboard.settings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>

            <div className="provider-dashboard-container" >
                <div className="farm-monitoring-header">
                    <h2>{t('provider.providerOverview')}</h2>
                    <p>{t('provider.providerOverviewDescription')}</p>
                </div>
                <div className="dashboard-cards-grid">
                    <div className="provider-dashboard-card highlight-card"><h2>{t('providerDashboard.totalFarms')}</h2><p>{totalFarms}</p></div>
                    < div className="provider-dashboard-card highlight-card" ><h2>{t('providerDashboard.waterUsedToday')}</h2><p>{totalWaterUsed.toLocaleString()} L</p></div>
                    <div className="provider-dashboard-card highlight-card"><h2>{t('providerDashboard.avgIrrigationTime')}</h2><p>{avgIrrigationTime} mins</p></div>
                    <div className="provider-dashboard-card highlight-card"><h2>{t('providerDashboard.landCoverage')}</h2><p>{TotalLandCoverage} (ha)</p></div><div className="provider-dashboard-card highlight-card"><h2>{t('providerDashboard.activeAlerts')}</h2><p>{activeAlerts}</p></div>
                </div>

                <div className="dashboard-sections-grid">
                    <div className="dashboard-section" >
                        <h3>{t('providerDashboard.insightsTitle')}</h3>
                        <p style={{ marginTop: "0.5rem", lineHeight: 1.6 }}>{t('providerDashboard.insightsDescription')}</p>
                    </div>

                    <div className="dashboard-section" >
                        <h3>{t('providerDashboard.recommendationsTitle')}</h3>
                        <p style={{ marginTop: "0.5rem", lineHeight: 1.6 }}>{t('providerDashboard.recommendationsDescription')}</p>
                    </div>

                </div>
                <div className="dashboard-charts-grid">
                    <div className="dashboard-chart">
                        <h3>{t('providerDashboard.avgEfficiency')}</h3>
                        <Bar data={chartData} options={chartOptions as any} />
                    </div>
                    <div className="dashboard-map">
                        <CellLevelMap />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
