import { useState } from "react";
import { Link } from "react-router-dom";
import Chat from "/chat.png";
import FAQs from "/FAQs.png";
import GettingStarted from "/getting-started.png";
import UserGuide from "/guide.png";
import QMSupport from "/question-mark.png";
import QMSupport2 from "/question-mark2.png";
import SettingsIcon from "/Settings.png";
import Video from "/video-player.png";
import VideoPlayer from "/video2.png";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const SupportEducation: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { currentLang, setLang } = useGlobalContext();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("videos");
    const supportQuestions = [
        "How do I know when to irrigate?",
        "How do I know when to irrigate?",
        "How do I know when to irrigate?",
        "How do I know when to irrigate?",
    ];
    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">
                    <Link to="/dashboard/farmer/notifications"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <div className="page-title-text1"> <h1>{t('support.title')}</h1></div>
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
            <div className="support-container">
                {/* Tabs*/}
                <div className="support-tabs">
                    <button className={activeTab === "videos" ? "active-tab" : "inactive-tab"} onClick={() => setActiveTab("videos")}><img src={VideoPlayer} alt="support" />Video Tutorials</button>
                    <button className={activeTab === "guides" ? "active-tab" : "inactive-tab"} onClick={() => setActiveTab("guide")}><img src={UserGuide} alt="support" />User Guide</button>
                    <button className={activeTab === "faqs" ? "active-tab" : "inactive-tab"} onClick={() => setActiveTab("faqs")} id="faqs"><img src={QMSupport} alt="support" />FAQs</button>
                    <button className={activeTab === "chat" ? "active-tab" : "inactive-tab"} onClick={() => setActiveTab("chat")}><img src={Chat} alt="support" />Chat Support</button>
                </div>
                {/* Main Content */}
                <div className="support-content">
                    {activeTab === "videos" && (
                        <div className="support-left">
                            <div className="video-placeholder">
                                <img src={Video} alt="support" className="play-icon" />
                            </div>
                            <p>Watch our video tutorials to learn how to use Aquasentinel</p>
                        </div>
                    )}
                    {activeTab === "guide" && (
                        <div className="support-right">
                            <div className="support-buttons">
                                <button className="support-button"><img src={GettingStarted} alt="support" />Getting Started</button>
                                <button className="support-button"><img src={SettingsIcon} alt="support" />Settings</button>
                                <button className="support-button"><img src={FAQs} alt="support" />FAQs</button>
                            </div>

                            <div className="support-questions">
                                {supportQuestions.map((question, index) => (
                                    <div className="question-card" key={index}>
                                        <img src={QMSupport2} alt="support" />
                                        <p>{question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === "faqs" && (
                        <div className="support-right">
                            <div className="support-buttons">
                                <button className="support-button"><img src={GettingStarted} alt="support" />Getting Started</button>
                                <button className="support-button"><img src={SettingsIcon} alt="support" />Settings</button>
                                <button className="support-button"><img src={FAQs} alt="support" />FAQs</button>
                            </div>

                            <div className="support-questions">
                                {supportQuestions.map((question, index) => (
                                    <div className="question-card" key={index}>
                                        <img src={QMSupport2} alt="support" />
                                        <p>{question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === "chat" && (
                        <div className="support-right">
                            <div className="support-buttons">
                                <button className="support-button"><img src={GettingStarted} alt="support" />Getting Started</button>
                                <button className="support-button"><img src={SettingsIcon} alt="support" />Settings</button>
                                <button className="support-button"><img src={FAQs} alt="support" />FAQs</button>
                            </div>

                            <div className="support-questions">
                                {supportQuestions.map((question, index) => (
                                    <div className="question-card" key={index}>
                                        <img src={QMSupport2} alt="support" />
                                        <p>{question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>

    );
}
