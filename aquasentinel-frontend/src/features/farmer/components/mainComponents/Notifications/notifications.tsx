import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { DateTime } from "luxon";
import { parse } from "papaparse";

interface Notification {
    id: string;
    title: string;
    read: boolean;
    createdAt: string;
    time: string;
}

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Notifications: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const [lastSession, setLastSession] = useState<any>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    useEffect(() => {
        const saved = localStorage.getItem("pump_notifications");
        if (saved) {
            return setNotifications(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/sensors/live-pump-session?sessionId=${lastSession?.id}`);
                const data = await res.json();

                if (
                    lastSession &&
                    data.session?.id === lastSession.id &&
                    data.session?.end_time === lastSession.end_time
                ) {
                    return; // ❌ Already displayed
                }

                if (data.session) {
                    const session = data.session;


                    const alert = session.end_time
                        ? `Pump turned OFF  `
                        : `Pump turned ON `;

                    const uniqueId = `${session.id}-${session.end_time ?? "live"}`;

                    const createdAt = DateTime.now().toISOTime();
                    console.log("Time Now:", createdAt);
                    setNotifications((prev) => {
                        // Load current notifications from localStorage
                        const existingNotifications = [...prev];


                        // Check if the new notification already exists
                        const alreadyExists = existingNotifications.some((n) => n.id === uniqueId);
                        if (alreadyExists) return prev;

                        // Build new notification
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



                    setLastSession(session);
                }
            } catch (err) {
                console.error("❌ Failed to fetch session:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [lastSession]);


    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications((prev) => {
                const updated = prev.map((notification) => {
                    const created = DateTime.fromISO(notification.createdAt);
                    const now = DateTime.now();
                    const diff = now.diff(created, ["minutes"]).minutes.toFixed(0);
                    return {
                        ...notification,
                        time: parseInt(diff) === 0 ? "now" : `${diff} min${parseInt(diff) > 1 ? "s" : ""} ago`,
                    };
                });

                localStorage.setItem("pump_notifications", JSON.stringify(updated));
                return updated;
            });
        }, 60000); // every 1 minute

        return () => clearInterval(timer);
    }, []);


    const clearAllNotifications = () => {
        setNotifications([]);
    };
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/export-logs"><img src="../../fast-backward.png" alt="back" className="back-icon" /></Link>
                    <h1>Notifications</h1>
                    <Link to="/dashboard/farmer/support-education"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile"><img className="profile-icon" src="../../profile-pic.png" alt="" />

                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">Settings</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <button className="clear-all" onClick={clearAllNotifications}>Clear All</button>
                </div>
                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`notification-card ${notification.read ? "read" : "unread"}`}>
                            <div className="notification-content">
                                <strong>{notification.title}</strong>
                                <small>{notification.time}</small>
                            </div>
                            <button className="mark-read" >Mark as read</button>
                        </div>
                    ))}
                </div>

            </div>
        </div>

    );
}
