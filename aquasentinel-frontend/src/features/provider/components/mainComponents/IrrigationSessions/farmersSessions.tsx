import { useEffect, useState } from "react";
import api from "../../../../../utils/axiosInstance";

export interface PumpSession {
    id: number;
    date: string;
    start_time: string;
    end_time: string | null;
    duration: number | null;
    total_liters: number | null;
    status: string;
    farmowner: string;
    farmname: string;
    farmlocation: string;
    farmphone: string;
}

const useAllPumpSessions = () => {
    const [sessions, setSessions] = useState<PumpSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await api.get("/api/sensors/all-pump-sessions");
                const data = await res.data as { sessions: PumpSession[] };
                setSessions(data.sessions || []);
                console.log("Sessions fetched:", data.sessions);

            } catch (err: any) {
                setError(err.message || "Failed to fetch pump sessions");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
        const interval = setInterval(fetchSessions, 1000); // refresh every 1 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    return { sessions, loading, error };
};

export default useAllPumpSessions;
