import mockCompliance from "./mockComplianceReportsData";
const exportCSV = () => {
    const headers = ["District", "Zone", "Farms", "Compliant", "Avg Efficiency(%)", "Compliance Rate(%)", "Water Used(m³)"];
    const rows = mockCompliance.map((row) => [
        row.district,
        row.zone,
        row.farms,
        row.compliant,
        `${row.avgEfficiency}`,
        `${((row.compliant / row.farms) * 100).toFixed(1)}`,
        `${row.waterUsed} `
    ]);

    const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "compliance_efficiency_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default exportCSV;