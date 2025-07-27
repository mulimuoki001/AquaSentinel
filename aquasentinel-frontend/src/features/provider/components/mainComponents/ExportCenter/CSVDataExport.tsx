import mockFarmsData from "../MockData/mockFarmsData";
const exportCSV = () => {
    const headers = ["District", "Zone", "Sector", "Cell", "Village", "Avg Efficiency(%)", "Farm Name", "Owner", "Water Used(L)"];
    const rows = mockFarmsData.map((row) => [
        row.district,
        row.zone,
        row.sector,
        row.cell,
        row.village,
        `${row.avgEfficiency}`,
        row.farmName,
        row.owner,
        row.waterUsedToday.toFixed(2)
    ]);

    const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "provider_farms_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default exportCSV;