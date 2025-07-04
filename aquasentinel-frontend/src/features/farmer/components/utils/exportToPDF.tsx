import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface WaterFlowEntry {
    id?: number;
    timestamp: Date | undefined;
    flowrate: number;
    flowunit: string | undefined;
    pumpstatus: string | undefined;
    date: string | undefined;
    time: string | undefined;
}

export function exportToPDF(data: WaterFlowEntry[], filename = "waterflow_logs.pdf") {
    const doc = new jsPDF();

    const tableBody = data.map((entry) => [
        entry.id ?? "", // Use empty string if id is not provided
        entry.timestamp ? entry.timestamp.toLocaleString() : "", // Format date as needed
        entry.flowrate, // Format flow rate to 2 decimal places
        entry.flowunit ?? "",
        entry.pumpstatus ?? "",
        entry.date ?? "", // Use empty string if date is not provided
        entry.time ?? "", // Use empty string if time is not provided

    ]);

    doc.setFontSize(16);
    doc.text("Water Flow Logs", 14, 15);

    // ✅ Use the imported function correctly
    autoTable(doc, {
        head: [["ID", "Timestamp", "Flow Rate", "Flow Unit", "Pump Status", "Date", "Time"]],
        body: tableBody,
        startY: 20,
        theme: "striped",
    });

    doc.save(filename);
}
