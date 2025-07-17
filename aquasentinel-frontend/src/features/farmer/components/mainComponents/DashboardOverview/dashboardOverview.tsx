import { Link } from "react-router-dom";
import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip
} from "recharts";

import useGlobalContext from "../../../../context/useGlobalContext";
import { useMemo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { t } = useTranslation();
    const { currentLang, setLang } = useGlobalContext();
    const { waterUsageToday } = useGlobalContext();
    const [showHelp, setShowHelp] = useState<"water" | "moisture" | "pump" | null>(null);
    const { waterFlowRateBuckets, waterFlow, moisture, waterUsed, pumpRuntime } = useGlobalContext();
    const pumpStatus = waterFlow?.pumpStatus || "OFF";
    const pumpColor = pumpStatus === "ON" ? "green" : "red";
    const maxPumpRate = 30;
    const pumpRate = waterFlow?.waterFlow || 0;
    const { unreadNotifications } = useGlobalContext();
    const gaugeData = [
        {
            name: "Pump Rate",
            value: pumpRate,
            fill: pumpRate < 10 ? "#FF4C4C" : pumpRate < 20 ? "#FFC107" : "#00C49F"
        },
    ];



    const usageChartData = useMemo(() =>
        waterFlowRateBuckets.map(bucket => ({
            time: bucket.time_label.slice(0, 5),
            rate: (bucket.avg_flow_rate || 0).toFixed(2),
        })), [waterFlowRateBuckets]);


    const usageChartData2 = useMemo(() =>
        waterUsageToday.map(bucket => ({
            time: bucket.time_label.slice(0, 5),
            liters: (bucket.liters_used || 0).toFixed(2),
        })), [waterUsageToday]);



    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <div className="page-title-text"> <h1>{t('dashboard.overview')}</h1></div>
                    <Link to="/dashboard/farmer/irrigation-history"><img src="../fast-forward.png" alt="forward" /></Link>
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
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">{t('dashboard.settings')}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t('dashboard.logout')}</a>
                    </div>
                </div>
            </div>
            <div className="dashboard-overview-container">

                <div className="dashboard-cards">
                    <div className={`card ${showHelp === "water" ? "expanded" : ""}`}>
                        <h3>{t('dashboard.totalWaterUsed')}</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "water" ? null : "water"))}
                        />
                        <p>{waterUsed}<span>L</span></p>
                        {showHelp === "water" && (
                            <div className="popup-card">
                                <ul>
                                    <li>{t('popUpCard.waterUsedl1')}</li>
                                    <li> {t('popUpCard.waterUsedl2')}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className={`card ${showHelp === "moisture" ? "expanded" : ""}`}>
                        <h3>{t('dashboard.currentSoilMoisture')}</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "moisture" ? null : "moisture"))}
                        />
                        <p>{moisture?.moisture}<span>{moisture?.moistureUnit}</span></p>
                        {showHelp === "moisture" && (
                            <div className="popup-card">
                                {t('popUpCard.soilMoisturel1')}
                            </div>
                        )}
                    </div>

                    <div className={`card ${showHelp === "pump" ? "expanded" : ""}`}>
                        <h3>{t('dashboard.pumpRuntime')}</h3>
                        <img
                            src="../../info.png"
                            className="info-icon"
                            onClick={() => setShowHelp(prev => (prev === "pump" ? null : "pump"))}
                        />
                        <p>
                            {typeof pumpRuntime === "number"
                                ? pumpRuntime >= 60
                                    ? `${(pumpRuntime / 60).toFixed(0)} hrs`
                                    : `${pumpRuntime.toFixed(0)} mins`
                                : "--"}
                        </p>
                        {showHelp === "pump" && (
                            <div className="popup-card">
                                {t('popUpCard.pumpRuntimel1')}
                            </div>
                        )}

                    </div>
                    <div className="dashboard-cards2">
                        <div className="flow-rate">
                            <div className="flow-rate-title"><h3>{t('dashboard.flowRate')}</h3></div>
                            <div className="flow-rate-graph">
                                <div style={{ width: "100%", height: "100%" }}>
                                    <ResponsiveContainer width="100%" height={300} >
                                        <LineChart data={usageChartData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>

                                            <XAxis
                                                dataKey="time"
                                                interval={1}
                                                tick={({ x, y, payload }) => (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        textAnchor="end"
                                                        transform={`rotate(-45 ${x},${y})`}
                                                        fontSize={10}
                                                        fill="#ccc"
                                                    >
                                                        {payload.value}
                                                    </text>
                                                )}
                                                label={{ value: "Time", position: "insideBottom", dy: 20, fontSize: 15, fontWeight: "bold" }}
                                            />
                                            <YAxis label={{ value: "FlowRate(L/min)", angle: -90, position: "insideLeft" }} />
                                            <Tooltip formatter={(value: number) => `${value} L/min`} />
                                            <Line type="monotone" dataKey="rate" stroke="limegreen" strokeWidth={2} dot={{ r: 2 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className="pump-rate">
                            <div className="pump-rate-title"><h3>{t('dashboard.pumpRate')}</h3></div>
                            <div className="pump-rate-graph">
                                <div style={{ position: "relative", width: "160px", height: "260px", margin: "20px auto" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="80%"
                                            outerRadius="100%"
                                            startAngle={180}
                                            endAngle={0}
                                            barSize={10}
                                            dataKey="value"
                                            data={gaugeData}
                                        >
                                            <PolarAngleAxis type="number" domain={[0, maxPumpRate]} tick={false} />
                                            <RadialBar background dataKey="value" cornerRadius={10} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    {/* ⏱️ Rotating Needle */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "30%",
                                            left: "50%",
                                            width: "2px",
                                            height: "50px",
                                            backgroundColor: "#FF0000",
                                            transformOrigin: "bottom center",
                                            transform: `rotate(${270 + (pumpRate / maxPumpRate) * 180}deg)`,
                                            transition: "transform 0.4s ease-in-out",
                                            zIndex: 2,
                                        }}
                                    />
                                    {/* ✅ Center tick/label */}
                                    <div style={{
                                        position: "absolute",
                                        top: "58%",
                                        left: "35%",
                                        transform: "translate(-20%, -20%)",
                                        color: "green",
                                        fontWeight: "bold",
                                        fontSize: "16px"
                                    }}>
                                        {pumpRate} {waterFlow?.flowUnit || 'L/min'}
                                    </div>
                                </div>


                            </div>

                        </div>

                        <div className="pump-status">
                            <h3 className="pump-status-title">{t('dashboard.pumpStatus')}</h3>
                            <div className="pump-status-current"><div className="pump-status-now" style={{ backgroundColor: pumpColor }}><h1>{waterFlow?.pumpStatus}</h1></div></div>
                        </div>
                    </div>
                    <div className="dashboard-cards3">
                        <div className="water-usage">
                            <div className="water-usage-line-graph"><div style={{ width: "100%", height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={usageChartData2} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>

                                        <XAxis
                                            dataKey="time"
                                            interval={30}

                                            tick={({ x, y, payload }) => (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor="end"
                                                    transform={`rotate(-45 ${x},${y})`}
                                                    fontSize={10}
                                                    fill="#ccc"

                                                >
                                                    {payload.value}
                                                </text>
                                            )}
                                            label={{ value: "Time", position: "insideBottom", dy: 20 }}
                                        />


                                        <YAxis unit="L" label={{ value: "Water Usage", angle: "-90", position: "insideLeft", fill: "#ccc" }} fill="#ccc" />
                                        <Tooltip formatter={(value: number) => `${value} L`} />
                                        <Bar dataKey="liters" fill="green" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            </div>
                        </div>
                        <div className="dashboard-alerts">
                            <div className="alerts-title"><h3>{t('dashboard.alerts')}</h3></div>
                            <div className="alerts">
                                {unreadNotifications.length === 0 ? (
                                    <p className="no-alerts">{t('dashboard.noNewAlerts')}</p>
                                ) : (
                                    unreadNotifications.map((alert, index) => (
                                        <div key={index} className="alert-item">
                                            <div className="alert">
                                                <p>{alert.title}</p>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

