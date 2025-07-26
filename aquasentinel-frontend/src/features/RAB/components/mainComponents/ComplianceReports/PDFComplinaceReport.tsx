import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import mockCompliance from "./mockComplianceReportsData";

const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Compliance & Efficiency Report", 14, 20);

    const tableData = mockCompliance.map((row) => [
        row.district,
        row.zone,
        row.farms,
        row.compliant,
        `${row.avgEfficiency}`,
        `${((row.compliant / row.farms) * 100).toFixed(1)}`,
        `${row.waterUsed.toLocaleString()} `
    ]);

    autoTable(doc, {
        head: [["District", "Zone", "Farms", "Compliant", "Avg Efficiency(%)", "Compliance Rate(%)", "Water Used(m³)"]],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [21, 104, 187] } // matches your theme
    });

    doc.save("compliance_efficiency_report.pdf");
};

export default downloadPDF;