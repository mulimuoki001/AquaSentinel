import { useEffect, useState } from "react";


export interface WaterFlowData {
    waterFlow: number;
    flowUnit: string;
    pumpStatus: string;
}

const useGraphData = () => {
    const [waterUsageBuckets, setWaterUsageBuckets] = useState<any[]>([]); // Adjust type as needed
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const resWaterUsageBuckets = await fetch("http://localhost:3000/api/sensors/water-usage-graph");
                if (!resWaterUsageBuckets.ok) {
                    throw new Error(`Water usage buckets fetch failed: ${resWaterUsageBuckets.status}`);
                }
                const dataWaterUsageBuckets = await resWaterUsageBuckets.json();
                setWaterUsageBuckets(dataWaterUsageBuckets?.data || []);
                setError(null); // ✅ Clear error on success
            } catch (err: any) {
                console.error("❌ Sensor fetch error:", err.message);
                setError(err.message || "Unknown error");
            }
        };

        console.log("🔄 Fetching initial sensor data");

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000); // every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return { waterUsageBuckets, error };
};

export default useGraphData;
