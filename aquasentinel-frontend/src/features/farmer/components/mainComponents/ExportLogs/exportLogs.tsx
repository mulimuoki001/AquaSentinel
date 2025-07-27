import { Link } from "react-router-dom";
import CSVIcon from "/CSV2.png";
import PDFIcon from "/PDF2.png";
import { exportToCSV } from "../../utils/exportCSV";
import { exportToPDF } from "../../utils/exportToPDF";
import useWaterFlowData from "../../../hooks/waterFlowData";
import Modal from "react-modal";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
Modal.setAppElement("#root");
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const ExportLogs: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { waterFlowDataList: waterFlowDataList } = useWaterFlowData();
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
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
                    <div className="page-title-text">  <h1>{t("exportLogs.title")}</h1></div>
                    <Link to="/dashboard/farmer/notifications"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-language">
                        <label htmlFor="lang-select" className="profile-link" style={{ marginRight: "8px" }}>
                            🌐
                        </label>
                        <select
                            id="lang-select"
                            value={currentLang}
                            onChange={(e) => setLang(e.target.value)}
                            className="profile-link"
                            style={{
                                background: " #0e2c38",
                                border: "1px solid #ccc",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                fontSize: "16px",
                                color: "#fff",
                                cursor: "pointer",
                                borderBlockColor: " #1568bb",
                                borderColor: " #1568bb"
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                        </select>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">{t("dashboard.settings")}</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>{t("dashboard.logout")}</a>
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
                        <h2 style={{ fontSize: "24px", color: "rgb(234, 242, 245)", marginBottom: "15px" }}>{t("exportLogs.modalTitle")}</h2>
                        <p>
                            {t("exportLogs.modalDesc1")}
                        </p>
                        <ul style={{ marginLeft: "1.2em" }}>
                            <li>{t("exportLogs.fields.dateTime")}</li>
                            <li>{t("exportLogs.fields.flowRate")}</li>
                            <li>{t("exportLogs.fields.flowUnit")}</li>
                            <li>{t("exportLogs.fields.pumpStatus")}</li>
                        </ul>
                        <p>
                            {t("exportLogs.modalDesc2")}
                        </p>
                        <button onClick={closeModal} style={{
                            marginTop: "20px",
                            backgroundColor: "#16B1FF", // primary AquaSentinel color
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}>{t("exportLogs.gotIt")}</button>
                    </Modal>

                    <button onClick={() => setIsModalOpen(true)} className="export-explanation-button" ><h1>{t("exportLogs.exportButtonTitle")}</h1></button>
                </div>
                <div className="export-buttons">
                    <div className="tooltip-container">
                        <button className="export-buttn csv" onClick={handleExportCSV}>
                            <img src={CSVIcon} alt="CSV" className="export-icon" />
                            <h3>{t("exportLogs.exportCSV")}</h3>
                        </button>
                        <div className="tooltip-text">
                            <strong>{t("exportLogs.csvTitle")}</strong><br />
                            <ul>
                                <li>{t("exportLogs.csvPoint1")}</li>
                                <li>{t("exportLogs.csvPoint2")}</li>
                                <li>{t("exportLogs.csvPoint3")}</li>
                            </ul>
                            <strong>{t("exportLogs.csvDesc")}</strong>
                        </div>
                    </div>

                    <div className="tooltip-container">
                        <button className="export-buttn pdf" onClick={handleExportPDF}>
                            <img src={PDFIcon} alt="PDF" className="export-icon" />
                            <h3>{t("exportLogs.exportPDF")}</h3>
                        </button>
                        <div className="tooltip-text">
                            <strong>{t("exportLogs.pdfTitle")}</strong><br />
                            <ul>
                                <li>{t("exportLogs.pdfPoint1")}</li>
                                <li>{t("exportLogs.pdfPoint2")}</li>
                                <li>{t("exportLogs.pdfPoint3")}</li>
                            </ul>
                            <strong>{t("exportLogs.pdfDesc")}</strong>

                        </div>
                    </div>
                </div>
            </div >
        </div >

    );
}
