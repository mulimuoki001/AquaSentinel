import React, { createContext, useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import type { MoistureData, WaterFlowData, WaterUsageBucket, Notification } from "../types/types";
import api from "../../utils/axiosInstance";

interface GlobalContextType {
    moisture: MoistureData | null;
    waterFlow: WaterFlowData | null;
    waterUsed: number | null;
    pumpRuntime: number | null;
    waterUsageBuckets: WaterUsageBucket[];
    notifications: Notification[];
    unreadNotifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [moisture, setMoisture] = useState<MoistureData | null>(null);
    const [waterFlow, setWaterFlow] = useState<WaterFlowData | null>(null);
    const [waterUsed, setWaterUsed] = useState<number | null>(null);
    const [pumpRuntime, setPumpRuntime] = useState<number | null>(null);
    const [waterUsageBuckets, setWaterUsageBuckets] = useState<WaterUsageBucket[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastStatus, setLastStatus] = useState<"ON" | "OFF" | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial localStorage load
    useEffect(() => {
        const saved = localStorage.getItem("pump_notifications");
        if (saved) setNotifications(JSON.parse(saved));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moistureRes, flowRes, usedRes, runtimeRes, bucketsRes, sessionRes] = await Promise.all([
                    api.get("/api/sensors/moisture"),
                    api.get("/api/sensors/water-flow"),
                    api.get("/api/sensors/water-used-last-1hr"),
                    api.get("/api/sensors/pump-runtime"),
                    api.get("/api/sensors/water-usage-graph"),
                    api.get("/api/sensors/live-pump-session"),
                ]);


                const moistureData: MoistureData | null = await moistureRes.data as MoistureData | null;
                setMoisture(moistureData || null);
                console.log("moistureData:", moistureData);

                const flowData: WaterFlowData | null = await flowRes.data as WaterFlowData | null;
                setWaterFlow(flowData || null);
                console.log("flowData:", flowData);

                const usedData: number | null = await usedRes.data as number | null;
                setWaterUsed(usedData || null);
                console.log("usedData:", usedData);

                const runtimeData: number | null = await runtimeRes.data as number | null;
                setPumpRuntime(runtimeData || null);

                const bucketsData: WaterUsageBucket[] = await bucketsRes.data as WaterUsageBucket[];
                setWaterUsageBuckets(bucketsData || []);

                const sessionData: any = await sessionRes.data;

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

                setError(null);


            } catch (err: any) {
                setError(err.message || "Unknown error");
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
                waterUsageBuckets,
                notifications,
                unreadNotifications,
                unreadCount,
                isLoading,
                error,
                setNotifications,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const ctx = useContext(GlobalContext);
    if (!ctx) throw new Error("useGlobalContext must be used within GlobalProvider");
    return ctx;
};
