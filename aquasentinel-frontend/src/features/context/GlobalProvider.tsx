import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import type { MoistureData, WaterFlowData, WaterFlowRateBucket, Notification, UserData, WaterUsageTodayBuckets } from "../types/types";
import GlobalContext from "./GlobalContext";
import i18n from "../../../i18n/i18n";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [moisture, setMoisture] = useState<MoistureData | null>(null);
    const [waterFlow, setWaterFlow] = useState<WaterFlowData | null>(null);
    const [waterUsed, setWaterUsed] = useState<number | null>(null);
    const [pumpRuntime, setPumpRuntime] = useState<number | null>(null);
    const [waterFlowRateBuckets, setWaterFlowRateBuckets] = useState<WaterFlowRateBucket[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastStatus, setLastStatus] = useState<"ON" | "OFF" | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [waterUsageToday, setWaterUsageToday] = useState<WaterUsageTodayBuckets[]>([]);
    const [currentLang, setLang] = useState("en");

    const setLanguage = (lang: string) => {
        i18n.changeLanguage(lang); // change the language = lang;
        setLang(lang);
        localStorage.setItem("lang", lang);
    };
    useEffect(() => {
        const savedLang = localStorage.getItem("lang") || "en";
        i18n.changeLanguage(savedLang); // change the language = savedLang;
        setLang(savedLang);
    }, []);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "lang") {
                const newLang = event.newValue || "en";
                i18n.changeLanguage(newLang);
                setLang(newLang);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);



    // Initial localStorage load
    useEffect(() => {
        const saved = localStorage.getItem("pump_notifications");
        if (saved) setNotifications(JSON.parse(saved));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moistureRes, flowRes, usedRes, runtimeRes, bucketsRes,] =
                    await Promise.all([
                        fetch("/api/sensors/moisture"),
                        fetch("/api/sensors/water-flow"),
                        fetch("/api/sensors/water-used-last-1hr"),
                        fetch("/api/sensors/pump-runtime"),
                        fetch("/api/sensors/flow-rate-graph"),

                    ]);

                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const userRes = await fetch("/users/data", {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const userJson = await userRes.json();
                        setUserData(userJson);

                        //fetch water usage today for this user 
                        const waterUsageTodayRes = await fetch(`/api/sensors/water-usage-today/${userJson.id}`);
                        const waterUsageTodayJson = await waterUsageTodayRes.json();
                        setWaterUsageToday(waterUsageTodayJson?.data || []);
                    } catch (err) {
                        console.error("User data fetch failed", err);
                    }
                }

                const moistureData = await moistureRes.json();
                setMoisture(moistureData?.data?.[0] || null);

                const flowData = await flowRes.json();
                setWaterFlow(flowData?.data?.[0] || null);

                const usedData = await usedRes.json();
                setWaterUsed(usedData?.totalWaterUsed || null);

                const runtimeData = await runtimeRes.json();
                setPumpRuntime(runtimeData?.runtimeMinutes || null);

                const bucketsData = await bucketsRes.json();
                setWaterFlowRateBuckets(bucketsData?.data || []);
                try {
                    const sessionRes = await fetch("/api/sensors/live-pump-session", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const sessionData = await sessionRes.json();
                    const session = sessionData?.session;
                    if (session) {
                        const currentStatus: "ON" | "OFF" = session.end_time ? "OFF" : "ON";
                        const uniqueId = `${session.id}-${session.end_time ?? "live"}`;

                        if (currentStatus !== lastStatus) {
                            const newNotif: Notification = {
                                id: uniqueId,
                                title: currentStatus === "OFF" ? "Pump turned OFF" : "Pump turned ON",
                                read: false,
                                createdAt: DateTime.now().toISO(),
                                time: "now",
                            };

                            setNotifications((prev) => {
                                if (prev.some((n) => n.id === newNotif.id)) return prev;
                                const updated = [newNotif, ...prev];
                                localStorage.setItem("pump_notifications", JSON.stringify(updated));
                                return updated;
                            });

                            setLastStatus(currentStatus);
                        }
                    }
                } catch (err) {

                }
                setError(null);


            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [lastStatus]);

    // Update notification time labels
    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications((prev) =>
                prev.map((n) => {
                    const diff = DateTime.now().diff(DateTime.fromISO(n.createdAt), "minutes").minutes;
                    let time = "now";
                    if (diff >= 1 && diff < 60) time = `${Math.floor(diff)} min ago`;
                    else if (diff >= 60 && diff < 1440) time = `${Math.floor(diff / 60)} hrs ago`;
                    else if (diff >= 1440) time = `${Math.floor(diff / 1440)} days ago`;
                    return { ...n, time };
                })
            );
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const unreadNotifications = notifications.filter((n) => !n.read);
    const unreadCount = unreadNotifications.length;

    return (
        <GlobalContext.Provider
            value={{
                moisture,
                waterFlow,
                waterUsed,
                pumpRuntime,
                waterFlowRateBuckets,
                notifications,
                unreadNotifications,
                unreadCount,
                isLoading,
                error,
                userData,
                waterUsageToday,
                i18n,
                currentLang,
                setLang: setLanguage,
                setUserData,
                setNotifications,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;