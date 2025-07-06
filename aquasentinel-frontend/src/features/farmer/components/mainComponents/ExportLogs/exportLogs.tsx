import { Link } from "react-router-dom";
import CSVIcon from "/CSV2.png";
import PDFIcon from "/PDF2.png";
import { exportToCSV } from "../../utils/exportCSV";
import { exportToPDF } from "../../utils/exportToPDF";
import useWaterFlowData from "../../../hooks/waterFlowData";
import useFarmerData from "../../../hooks/farmerData";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const ExportLogs: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { waterFlowDataList: waterFlowDataList, error } = useWaterFlowData();
    const { data } = useFarmerData();
    const handleExportCSV = () => {
        const csvReadyData = waterFlowDataList
        exportToCSV(csvReadyData, "waterflow_logs.csv");
    };
    const handleExportPDF = () => {
        const pdfReadyData = waterFlowDataList.map((entry) => ({
            id: entry.id,
            timestamp: entry.timestamp, // Format date as needed
            flowrate: entry.flowrate,
            flowunit: entry.flowunit,
            pumpstatus: entry.pumpstatus,
            date: entry.date,
            time: entry.time
        }));
        console.log("PDF Ready Data:", pdfReadyData);
        exportToPDF(pdfReadyData, "waterflow_logs.pdf");
    };
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/smart-recommendations"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <h1>Export Logs</h1>
                    <Link to="/dashboard/farmer/notifications"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile"><img src={data?.profile_pic ? `http://localhost:3000/uploads/${encodeURIComponent(data.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />

                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">Settings</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
            <div className="export-logs-container">
                <div className="export-title">
                    <h1>Export Logs</h1>
                </div>
                <div className="export-buttons">
                    <button className="export-btn csv" onClick={handleExportCSV}>
                        <img src={CSVIcon} alt="CSV" className="export-icon" />
                        <h3>Export CSV</h3>
                    </button>
                    <button className="export-btn pdf" onClick={handleExportPDF}>
                        <img src={PDFIcon} alt="PDF" className="export-icon" />
                        <h3>Export PDF</h3>
                    </button>
                </div>
            </div>
        </div>

    );
}
