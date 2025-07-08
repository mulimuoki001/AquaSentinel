import { useEffect, useState } from "react";

interface waterUsedDaily {
    date: string;
    total_water_used: number;
    avg: number;
}

export default function useTotalWaterUsedDaily(userId: number | undefined) {
    const [totalWaterUsed, setTotalWaterUsed] = useState<waterUsedDaily[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchDailyWaterUsage = async () => {
            try {
                const res = await fetch(`/api/sensors/total-water-used-daily-by-user/${userId}`);
                const data = await res.json();

                setTotalWaterUsed(data.totalWaterUsed || []);
                setError(null); // clear previous error if successful
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Failed to fetch irrigation data");
            } finally {
                setLoading(false);
            }
        };

        fetchDailyWaterUsage(); // initial fetch
        const interval = setInterval(fetchDailyWaterUsage, 1000); // refresh every 1 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, [userId]);

    return { totalWaterUsed, loading, error };
}
