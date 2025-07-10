import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";

export interface WaterFlowData {
    id?: number;
    flowrate: number;
    flowunit?: string;
    pumpstatus?: string;
    timestamp?: Date;
    date?: string;
    time?: string;
}

const useWaterFlowData = () => {
    const [waterFlowDataList, setWaterFlowData] = useState<WaterFlowData[]>([]) || [];
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWaterFlowData = async () => {
            try {
                const res = await api.get("/api/sensors/all-water-flow-data");

                if (res.status !== 200) {
                    throw new Error(`Water flow data fetch failed: ${res.status}`);
                }
                const json: any = await res.data;
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
