import { Link } from "react-router-dom";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import mockFarmsData from "../MockData/mockFarmsData";
import CellLevelMap from "./farmMap";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}
export const FarmMonitoring: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    const [selectedZone, setSelectedZone] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [minEfficiency, setMinEfficiency] = useState("");

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/provider/"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <div className="page-title-tex"> <h1>{t('providerFarmMonitoring.farmMonitoring')}</h1></div>
                    <Link to="/dashboard/provider/irrigation-sessions">
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

            <div className="farm-monitoring-container" style={{ padding: "2rem" }}>
                <div className="farm-monitoring-header">
                    <h2>{t('providerFarmMonitoring.farmOverviewTitle')}</h2>
                    <p>{t('providerFarmMonitoring.farmOverviewDescription')}</p>
                </div>
                <div className="filters">
                    <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                        <option value="">All Zones</option>
                        {[...new Set(mockFarmsData.map(d => d.zone))].map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                        ))}
                    </select>

                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                        <option value="">All Districts</option>
                        {[...new Set(mockFarmsData.map(d => d.district))].map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={minEfficiency}
                        onChange={(e) => setMinEfficiency(e.target.value)}
                        placeholder="Min Efficiency (%)"
                        style={{ width: "180px" }}
                    />
                    <button onClick={() => {
                        setSelectedZone("");
                        setSelectedDistrict("");
                        setMinEfficiency("");
                    }}>
                        Reset Filters
                    </button>
                </div>

                <div style={{ marginTop: "2rem", overflowX: "auto", overflowY: "auto", maxHeight: "60vh" }}>
                    <table className="farm-table">
                        <thead>
                            <tr>
                                <th>{t('providerFarmMonitoring.farmName')}</th>
                                <th>{t('providerFarmMonitoring.owner')}</th>
                                <th>{t('providerFarmMonitoring.location')}</th>
                                <th>{t('providerFarmMonitoring.moisture')}</th>
                                <th>{t('providerFarmMonitoring.avgEfficiency')}</th>
                                <th>{t('providerFarmMonitoring.lastIrrigated')}</th>
                                <th>{t('providerFarmMonitoring.farmSize')}</th>
                                <th>{t('providerFarmMonitoring.pumpStatus')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockFarmsData
                                .filter(farm => {
                                    const zoneMatch = selectedZone === "" || farm.zone === selectedZone;
                                    const districtMatch = selectedDistrict === "" || farm.district === selectedDistrict;
                                    const efficiencyMatch = minEfficiency === "" || farm.avgEfficiency >= parseFloat(minEfficiency);
                                    return zoneMatch && districtMatch && efficiencyMatch;
                                })
                                .map(farm => (
                                    <tr key={farm.farmId}>
                                        <td>{farm.farmName}</td>
                                        <td>{farm.owner}</td>
                                        <td>{farm.district}</td>
                                        <td>{farm.moisture}</td>
                                        <td>{farm.avgEfficiency}</td>
                                        <td>{farm.lastIrrigated}</td>
                                        <td>{farm.farmSize} </td>
                                        <td style={{ color: farm.pumpStatus === "ON" ? "green" : "red" }}>
                                            {farm.pumpStatus}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>

                <div className="map-container">
                    <CellLevelMap />
                </div>
            </div>
        </div>
    );
};
