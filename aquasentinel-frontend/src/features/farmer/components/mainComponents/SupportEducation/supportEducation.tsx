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

interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const SupportEducation: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { userData } = useGlobalContext();
    const data = userData;
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
                    <h1>Support & Education</h1>
                    <Link to="/dashboard/farmer/farmer-profile"><img src="../../fast-forward.png" alt="forward" /></Link>
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
