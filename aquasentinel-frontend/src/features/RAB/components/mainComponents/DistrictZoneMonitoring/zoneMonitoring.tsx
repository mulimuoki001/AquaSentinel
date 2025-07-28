import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useGlobalContext from "../../../../context/useGlobalContext";
import mockData from "../MockData/mockData";
import "../CSS/zoneMonitoring.css";
import DistrictZoneMap from "./districtZoneMap";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}


interface mockDataInterface {
    district: string;
    zone: string;
    farms: number;
    compliant: number;
    offlineFarms: number;
    onlineFarms: number;
    avgEfficiency: number; // percentage, e.g., 74 means 74%
    waterUsed: number;     // in liters
}


export const DistrictZoneMonitoring: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    const [selectedDistrict, setSelectedDistrict] = useState("All");
    const mockDistricts: mockDataInterface[] = mockData;

    const filteredDistricts =
        selectedDistrict === "All"
            ? mockDistricts
            : mockDistricts.filter((d) => d.district === selectedDistrict);

    return (
        <div className="layout">
            {/* Topbar */}
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">

                    <Link to="/dashboard/RAB/">
                        <img src="../../fast-backward.png" className="back-icon" alt="back" />
                    </Link>
                    <div className="page-title-tex">
                        <h1>{t("rabData.zoneMonitoringTitle")}</h1>
                    </div>
                    <Link to="/dashboard/RAB/alerts">
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
            <div className="zone-monitoring-container">
                <div className="zone-monitoring-header">
                    <p className="zone-desc">{t("rabData.zoneMonitoringDescription")}</p>
                </div>
                <div className="zone-monitoring-controls">
                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                        <option value="All">{t("rabData.filterAllDistricts")}</option>
                        {mockDistricts.map((d, i) => (
                            <option key={i} value={d.district}>
                                {d.district}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="zone-monitoring-grid">
                    {filteredDistricts.map((district, index) => (
                        <div className="zone-card" key={index}>
                            <h3>{district.district} District</h3>
                            <p>
                                {t("rabData.onlineFarms")}: <strong>{district.onlineFarms}</strong>
                            </p>
                            <p>
                                {t("rabData.offlineFarms")}: <strong>{district.offlineFarms}</strong>
                            </p>
                            <p>
                                {t("rabData.avgEfficiency")}: <strong>{district.avgEfficiency}%</strong>
                            </p>
                        </div>
                    ))}
                </div>
                <div className="map-container">

                    <DistrictZoneMap />

                </div>
            </div>
        </div>
    );
};
