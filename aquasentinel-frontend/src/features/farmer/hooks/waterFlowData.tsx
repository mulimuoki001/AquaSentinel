import { useEffect, useState } from "react";

export interface WaterFlowData {
    id?: number;
    flowrate: number;
    flowunit?: string;
    pumpstatus?: string;
    timestamp?: Date;
    date?: string;
    time?: string;
}

/**
 * Custom hook to fetch and manage water flow data.
 * Fetches data from the API every 5 seconds and returns the latest data and any error encountered.
 */

const useWaterFlowData = () => {
    const [waterFlowDataList, setWaterFlowData] = useState<WaterFlowData[]>([]) || [];
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWaterFlowData = async () => {
            try {
                const res = await fetch("/api/sensors/all-water-flow-data");

                if (!res.ok) {
                    throw new Error(`Water flow data fetch failed: ${res.status}`);
                }
                const json = await res.json();
                console.log("📊 Fetched water flow data from API:", json);
                setWaterFlowData(json?.data || []);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching water flow data:", err);
                setError(err.message || "Error");
            }
        };

        fetchWaterFlowData();
        const interval = setInterval(fetchWaterFlowData, 5000);
        return () => clearInterval(interval);
    }, []);

    return { waterFlowDataList, error };
};

export default useWaterFlowData;
