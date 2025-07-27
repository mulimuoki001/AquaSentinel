import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartImageProps {
    onReady: (imageUrl: string) => void;
}

const ChartImage: React.FC<ChartImageProps> = ({ onReady }) => {
    const chartRef = useRef<any>(null);

    const data = {
        labels: ["Nyagatare", "Bugesera", "Ngoma", "Kayonza"],
        datasets: [
            {
                label: "Avg Efficiency (%)",
                data: [85, 79, 60, 72],
                backgroundColor: "#4caf50",
            },
        ],
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const chartInstance = chartRef.current?.chart; // ✅ Access Chart.js instance
            if (!chartInstance) return;

            const base64 = chartInstance.toBase64Image("image/png", 1.0);
            console.log("✅ Chart base64:", base64);
            onReady(base64);
        }, 1500); // Allow full render

        return () => clearTimeout(timeout);
    }, [onReady]);

    return (
        <div style={{ display: "none" }}>
            <Bar ref={chartRef} data={data} />
        </div>
    );
};

export default ChartImage;
