import Papa from "papaparse";
import type { WaterFlowData } from "../../hooks/waterFlowData";

export function exportToCSV(data: WaterFlowData[], filename: string = "export.csv") {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
