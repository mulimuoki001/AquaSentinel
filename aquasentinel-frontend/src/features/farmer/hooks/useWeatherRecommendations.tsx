import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";

interface Recommendation {
    message: string;
}
interface WeatherData {
    forecast: {
        forecastday: {
            day: {
                daily_chance_of_rain: number;
                avghumidity: number;
                maxwind_kph: number;
                avgtemp_c: number;
            };
        }[];
    };
}

export function useWeatherRecommendations(pollingIntervalMs: number = 5 * 60 * 1000) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    const fetchWeather = async () => {
        try {
            const res = await api.get("/weather");
            if (res.status !== 200) {
                console.warn("⚠️ Weather API request failed:", res.status);
                return;
            }

            const data = await res.data as WeatherData;
            const forecastDays = data.forecast?.forecastday;
            const today = forecastDays?.[0]?.day;
            const tomorrow = forecastDays?.[1]?.day;

            const newRecs: Recommendation[] = [];

            if (tomorrow?.daily_chance_of_rain > 50) {
                newRecs.push({
                    message: "🌧 Rain Expected Tomorrow — Reduce irrigation today by 25% to avoid overwatering.",
                });
            }

            if (today?.avghumidity > 90) {
                newRecs.push({
                    message: "💧 High Humidity — Avoid overwatering, soil retains moisture longer.",
                });
            }

            if (today?.maxwind_kph > 18) {
                newRecs.push({
                    message: "🌬 Strong Winds — Delay irrigation to reduce evaporation.",
                });
            }

            if (today?.avgtemp_c > 30) {
                newRecs.push({
                    message: "☀️ High Temperature — Irrigate early morning or late evening to reduce evaporation.",
                });
            }

            if (newRecs.length === 0) {
                newRecs.push({
                    message: "✅ No alerts — Conditions favorable for normal irrigation.",
                });
            }

            setRecommendations(newRecs);
        } catch (err) {
            console.error("❌ Failed to fetch weather recommendations:", err);
        }
    };

    useEffect(() => {
        fetchWeather(); // Run immediately
        const intervalId = setInterval(fetchWeather, pollingIntervalMs); // Poll periodically

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [pollingIntervalMs]);

    return recommendations;
}
