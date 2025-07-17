import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import useGlobalContext from "../../../../context/useGlobalContext";
import api from "../../../../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
interface Notification {
    id: string;
    title: string;
    read: boolean;
    createdAt: string;
    time: string;
}

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void;
}
interface PumpSession {
    id: number;
    user_id: number;
    date: string;
    start_time: string;
    end_time: string | null;
    duration: number;
    total_liters: number;
    status: string;
}

export const Notifications: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { notifications, setNotifications } = useGlobalContext();
    const [lastStatus, setLastStatus] = useState<"ON" | "OFF" | null>(null);
    const { currentLang, setLang } = useGlobalContext();

    const { t } = useTranslation();

    // Polling for latest session

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await api.get("/api/sensors/live-pump-session");
                const data = await res.data as { session: PumpSession | null };

                if (data.session) {
                    const session = data.session;
                    const currentStatus: "ON" | "OFF" = session.end_time ? "OFF" : "ON";
                    const uniqueId = `${session.id}-${session.end_time ?? "live"}`;

                    if (currentStatus !== lastStatus) {
                        const alert = currentStatus === "OFF" ? t("notifications.alert.off") : t("notifications.alert.on");
                        const createdAt = DateTime.now().toISO();

                        setNotifications((prev) => {
                            const alreadyExists = prev.some((n) => n.id === uniqueId);
                            if (alreadyExists) return prev;

                            const newNotification: Notification = {
                                id: uniqueId,
                                title: alert,
                                read: false,
                                createdAt,
                                time: "now",
                            };

                            const updated = [newNotification, ...prev];
                            localStorage.setItem("pump_notifications", JSON.stringify(updated));
                            return updated;
                        });

                        setLastStatus(currentStatus); // 🔁 track last known status
                    }
                }
            } catch (err) {
                console.error("❌ Failed to fetch session:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [lastStatus, setNotifications]);

    // Update relative time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications((prev) => {
                const updated = prev.map((notification) => {
                    const created = DateTime.fromISO(notification.createdAt);
                    const now = DateTime.now();
                    const diffInMinutes = now.diff(created, "minutes").minutes;
                    let displayTime = "now";

                    if (diffInMinutes < 1) {
                        displayTime = "now";
                    } else if (diffInMinutes < 60) {
                        displayTime = `${Math.floor(diffInMinutes)} minute${Math.floor(diffInMinutes) !== 1 ? "s" : ""} ago`;
                    } else if (diffInMinutes < 1440) {
                        const hours = Math.floor(diffInMinutes / 60);
                        displayTime = `${hours} hour${hours !== 1 ? "s" : ""} ago`;
                    } else {
                        const days = Math.floor(diffInMinutes / 1440);
                        displayTime = `${days} day${days !== 1 ? "s" : ""} ago`;
                    }

                    return { ...notification, time: displayTime };
                });

                localStorage.setItem("pump_notifications", JSON.stringify(updated));
                return updated;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [setNotifications]);

    // Optional: reload when tab is refocused
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                window.location.reload(); // Or re-fetch notifications
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications((prev) => {
            const updated = prev.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            );
            localStorage.setItem("pump_notifications", JSON.stringify(updated));
            return updated;
        });
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        localStorage.removeItem("pump_notifications");
    };

    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/export-logs">
                        <img src="../../fast-backward.png" alt="back" className="back-icon" />
                    </Link>
                    <div className="page-title-text"> <h1>{t("notifications.title")}</h1></div>
                    <Link to="/dashboard/farmer/support-education">
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
                                background: " #0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "16px",
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
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>{t("notifications.current")}</h1>
                    <button className="clear-all" onClick={clearAllNotifications}>{t("notifications.clearAll")}</button>
                </div>
                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`notification-card ${notification.read ? "read" : "unread"}`}>
                            <div className="notification-content">
                                <strong>{notification.title}</strong>
                                <small>{notification.time}</small>
                            </div>
                            <button
                                className="mark-read"
                                onClick={() => markAsRead(notification.id)}
                                disabled={notification.read}
                            >
                                {notification.read ? t("notifications.read") : t("notifications.markAsRead")}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
