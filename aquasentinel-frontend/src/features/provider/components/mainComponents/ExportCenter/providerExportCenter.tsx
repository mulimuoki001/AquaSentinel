// src/features/provider/components/ProviderExportCenter.tsx
import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import exportCSV from "./CSVDataExport";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ChartImage from "./ChartImage";
import PDFReport from "./PDFReport";
import mockFarmsData from "../MockData/mockFarmsData";
import { useState, useEffect } from "react";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}

const ProviderExportCenter: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
    const [chartImg, setChartImg] = useState<string | null>(null);
    const totalFarms = mockFarmsData.length;
    const totalWater = mockFarmsData.reduce((sum, f) => sum + f.waterUsedToday, 0).toLocaleString();
    const avgEfficiency = (mockFarmsData.reduce((sum, f) => sum + f.avgEfficiency, 0) / totalFarms).toFixed(1);
    const alerts = mockFarmsData.filter(f => f.moisture < 25 || f.pumpStatus === "OFF").length;

    const handleExportCSV = () => {
        exportCSV();
    };
    useEffect(() => {
        console.log("🧪 Chart image received in Export Center:", chartImg); // ← DEBUG
    }, [chartImg]);

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/recommendations">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-tex">
                        <h1>{t("providerExportCenter.title") || "Export Center"}</h1>
                    </div>
                    <Link to="/dashboard/provider/alerts">
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
                            style={{
                                background: "#0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                fontSize: "16px",
                                color: "#fff",
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
                            <img className="settings-icon" src="../../Settings.png" alt="Settings" />
                        </Link>
                        <a className="settings-link" href="/dashboard/provider/settings">{t('dashboard.settings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-container" style={{ padding: "2rem" }}>
                <div className="export-container" style={{ padding: "2rem" }}>
                    <h2>{t("providerExportCenter.subtitle") || "Download Farm Reports"}</h2>
                    <p>{t("providerExportCenter.description") || "Export irrigation sessions or summaries for offline use."}</p>

                    <div className="export-options">
                        <button className="btn-export" onClick={handleExportCSV}>📄 Export Current Report Data (CSV)</button>
                        <div>
                            <ChartImage onReady={setChartImg} />
                            {!chartImg && <p style={{ color: "#fff" }}>Generating PDF chart...</p>}


                            {chartImg && (
                                <PDFDownloadLink
                                    document={
                                        <PDFReport
                                            chartImage={chartImg}
                                            totalFarms={totalFarms}
                                            totalWater={totalWater}
                                            avgEfficiency={avgEfficiency}
                                            alerts={alerts}
                                        />
                                    }
                                    fileName="AquaSentinel_Summary.pdf"
                                    className="btn-export"
                                >
                                    📊 Export Summary Stats (PDF)
                                </PDFDownloadLink>
                            )}
                        </div>
                        <ChartImage onReady={setChartImg} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderExportCenter;
