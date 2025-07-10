import { useEffect, useState } from "react";
import api from "../../../../../utils/axiosInstance";

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

export default function useIrrigationSessions(userId: number | undefined) {
  const [sessions, setSessions] = useState<PumpSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      try {
        const res = await api.get(`/api/sensors/user-pump-sessions/${userId}`);
        const data: any = await res.data;
        setSessions(data.sessions || []);
        setError(null); // clear previous error if successful
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
        setError("Failed to fetch irrigation data");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions(); // initial fetch
    const interval = setInterval(fetchSessions, 1000); // refresh every 1 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [userId]);

  return { sessions, loading, error };
}
