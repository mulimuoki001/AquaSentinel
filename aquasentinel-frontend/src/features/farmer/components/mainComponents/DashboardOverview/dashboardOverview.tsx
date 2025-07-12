import { Link } from "react-router-dom";
import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip
} from "recharts";

import { useGlobalContext } from "../../../../context/GlobalAppContext";
import { useMemo } from "react";

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const DashboardOverview: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { userData, waterUsageToday } = useGlobalContext();
    console.log("water Usage Today", waterUsageToday);

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






    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <h1>Dashboard Overview</h1>
                    <Link to="/dashboard/farmer/irrigation-history"><img src="../fast-forward.png" alt="forward" /></Link>
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
                        <img className="logout-icon" src="../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
            <div className="dashboard-overview-container">

                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Total Water Used(1hr)</h3>
                        <p>{waterUsed}<span>L</span></p>
                    </div>
                    <div className="card">
                        <h3>Current Soil Moisture</h3>
                        <p>{moisture?.moisture}<span>{moisture?.moistureUnit}</span></p>
                    </div>

                    <div className="card">
                        <h3>Pump Runtime</h3>
                        <p>
                            {typeof pumpRuntime === "number"
                                ? pumpRuntime >= 60
                                    ? `${(pumpRuntime / 60).toFixed(0)} hrs`
                                    : `${pumpRuntime.toFixed(0)} mins`
                                : "--"}
                        </p>

                    </div>
                    <div className="dashboard-cards2">
                        <div className="flow-rate">
                            <div className="flow-rate-title"><h3>Flow Rate - Last 1hr</h3></div>
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
                            <div className="pump-rate-title"><h3>Pump Rate</h3></div>
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
                            <h3 className="pump-status-title">Pump Status</h3>
                            <div className="pump-status-current"><div className="pump-status-now" style={{ backgroundColor: pumpColor }}><h1>{waterFlow?.pumpStatus}</h1></div></div>
                        </div>
                    </div>
                    <div className="dashboard-cards3">
                        <div className="water-usage">
                            <div className="water-usage-line-graph"><div style={{ width: "100%", height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={usageChartData}>

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
                                            label={{ value: "Time", position: "insideBottom", dy: 20 }}
                                        />


                                        <YAxis unit="L/min" label={{ value: "Flow Rate", angle: "-90", position: "insideLeft", fill: "#ccc" }} fill="#ccc" />
                                        <Tooltip formatter={(value: number) => `${value} L/min`} />
                                        <Bar dataKey="rate" fill="green" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            </div>
                        </div>
                        <div className="dashboard-alerts">
                            <div className="alerts-title"><h3>Alerts</h3></div>
                            <div className="alerts">
                                {unreadNotifications.length === 0 ? (
                                    <p className="no-alerts">No new alerts</p>
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

