import { useEffect, useState } from "react";

export interface MoistureData {
    moisture: number;
    moistureUnit: string;
    moistureChange: number;
}

export interface WaterFlowData {
    waterFlow: number;
    flowUnit: string;
    pumpStatus: string;
    timestamp: Date;
    date: string;
    time: string;
}

const useSensorData = () => {
    const [moisture, setMoisture] = useState<MoistureData | null>(null);
    const [waterFlow, setWaterFlow] = useState<WaterFlowData | null>(null);
    const [waterUsed, setWaterUsed] = useState<number | null>(null);
    const [pumpRuntime, setPumpRuntime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const resMoisture = await fetch("http://localhost:3000/api/sensors/moisture");
                if (!resMoisture.ok) {
                    throw new Error(`Moisture fetch failed: ${resMoisture.status}`);
                }
                const dataMoisture = await resMoisture.json();
                setMoisture(dataMoisture?.data?.[0] || null);

                const resFlow = await fetch("http://localhost:3000/api/sensors/water-flow");
                if (!resFlow.ok) {
                    throw new Error(`Flow fetch failed: ${resFlow.status}`);
                }
                const dataFlow = await resFlow.json();
                setWaterFlow(dataFlow?.data?.[0] || null);

                const resWaterUsed = await fetch("http://localhost:3000/api/sensors/water-used-last-1hr");
                if (!resWaterUsed.ok) {
                    throw new Error(`Water used fetch failed: ${resWaterUsed.status}`);
                }
                const dataWaterUsed = await resWaterUsed.json();
                setWaterUsed(dataWaterUsed?.totalWaterUsed || null);

                const resPumpRuntime = await fetch("http://localhost:3000/api/sensors/pump-runtime");
                if (!resPumpRuntime.ok) {
                    throw new Error(`Pump runtime fetch failed: ${resPumpRuntime.status}`);
                }
                const dataPumpRuntime = await resPumpRuntime.json();
                setPumpRuntime(dataPumpRuntime?.runtimeMinutes || null);


                setError(null); // ✅ Clear error on success
            } catch (err: any) {
                console.error("❌ Sensor fetch error:", err.message);
                setError(err.message || "Unknown error");
            }
        };

        console.log("🔄 Fetching initial sensor data");

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000); // every 1 second
        return () => clearInterval(interval);
    }, []);

    return { moisture, waterFlow, error, waterUsed, pumpRuntime };
};

export default useSensorData;
