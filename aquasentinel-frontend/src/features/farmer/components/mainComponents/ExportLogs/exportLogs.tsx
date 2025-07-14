import { Link } from "react-router-dom";
import CSVIcon from "/CSV2.png";
import PDFIcon from "/PDF2.png";
import { exportToCSV } from "../../utils/exportCSV";
import { exportToPDF } from "../../utils/exportToPDF";
import useWaterFlowData from "../../../hooks/waterFlowData";
import Modal from "react-modal";
import { useGlobalContext } from "../../../../context/GlobalAppContext";
import { useState } from "react";
Modal.setAppElement("#root");
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const ExportLogs: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { waterFlowDataList: waterFlowDataList } = useWaterFlowData();
    const { userData } = useGlobalContext();
    const data = userData;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
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
                        <Link to="/dashboard/farmer/farmer-profile"><img src={data?.profile_pic ? `/uploads/${encodeURIComponent(data.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />

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
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={() => closeModal()}
                        contentLabel="Export Explanation"
                        style={{
                            overlay: {
                                backgroundColor: "rgba(0, 0, 0, 0.5)", // dimmed background
                                zIndex: 1000,
                            },
                            content: {
                                maxWidth: "550px",
                                margin: "auto",
                                padding: "30px",
                                borderRadius: "12px",
                                backgroundColor: " #0e2c38", // from your style guide
                                color: "white",
                                fontFamily: "Arial, sans-serif",
                                boxShadow: "0 4px 16px rgba(102, 113, 114, 0.2)",
                                lineHeight: "1.6",
                            },
                        }}
                    >
                        <h2 style={{ fontSize: "24px", color: "rgb(234, 242, 245)", marginBottom: "15px" }}>Export Logs Explained</h2>
                        <p>
                            This page allows you to export your irrigation logs in either <strong>CSV</strong> or <strong>PDF</strong> format.
                            These logs include data such as:
                        </p>
                        <ul style={{ marginLeft: "1.2em" }}>
                            <li>Date and time of irrigation</li>
                            <li>Water flow rate (L/hr)</li>
                            <li>Water flow unit (L/min or GPM)</li>
                            <li>Pump status (ON/OFF)</li>
                        </ul>
                        <p>
                            Exporting helps you keep offline records and analyze your irrigation practices. Ideal for compliance, planning, or sharing with advisors.
                        </p>
                        <button onClick={closeModal} style={{
                            marginTop: "20px",
                            backgroundColor: "#16B1FF", // primary AquaSentinel color
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}>Got it!</button>
                    </Modal>

                    <button onClick={() => setIsModalOpen(true)} className="export-explanation-button" ><h1>Export Logs</h1></button>
                </div>
                <div className="export-buttons">
                    <div className="tooltip-container">
                        <button className="export-btn csv" onClick={handleExportCSV}>
                            <img src={CSVIcon} alt="CSV" className="export-icon" />
                            <h3>Export CSV</h3>
                        </button>
                        <div className="tooltip-text">
                            <strong>CSV Format:</strong><br />
                            - Open in Excel or Google Sheets<br />
                            - Includes timestamp, flow rate, pump status<br />
                            - Useful for data analysis and graphs
                            Use this format for deeper analysis, charts, or sharing with technical advisors.
                        </div>
                    </div>

                    <div className="tooltip-container">
                        <button className="export-btn pdf" onClick={handleExportPDF}>
                            <img src={PDFIcon} alt="PDF" className="export-icon" />
                            <h3>Export PDF</h3>
                        </button>
                        <div className="tooltip-text">
                            <strong>PDF Format:</strong><br />
                            - Print-friendly report<br />
                            - Contains summary of irrigation activity<br />
                            - Ideal for sharing and offline use
                            Use this format to print, share with agronomists, or keep official offline records.
                        </div>
                    </div>
                </div>
            </div >
        </div >

    );
}
