import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../../../../utils/axiosInstance";
import useGlobalContext from "../../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Profile: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const [personalEditMode, setPersonalEditMode] = useState(false);
    const [farmEditMode, setFarmEditMode] = useState(false);
    const { userData, currentLang, setLang } = useGlobalContext();
    const [updatedData, setUpdatedData] = useState({
        name: userData?.name,
        email: userData?.email,
        role: userData?.role,
        farmname: userData?.farmname,
        farmlocation: userData?.farmlocation,
        farmphone: userData?.farmphone,
    });
    const { t } = useTranslation();
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedData({
            ...updatedData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
        }
    }
    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        if (profileImage) {
            formData.append("profileImage", profileImage);
        }
        const emailChanged =
            updatedData.email &&
            updatedData.email.trim().toLowerCase() !== userData?.email?.toLowerCase();

        try {
            const response = await api.put("/users/update", formData); // ✅ Correct usage

            if (response.status === 200) {
                if (emailChanged) {
                    alert("Email changed. Please log in again.");
                    localStorage.removeItem("token");
                    handleLogout();
                } else {
                    alert("Profile updated successfully");
                    setPersonalEditMode(false);
                    setFarmEditMode(false);
                    console.log("Profile updated successfully");
                }
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };




    const resetChanges = () => {
        if (userData) {
            setUpdatedData({
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || '',
                farmname: userData.farmname || '',
                farmlocation: userData.farmlocation || '',
                farmphone: userData.farmphone || '',
            });
            setProfileImage(null); // reset image too
            setPersonalEditMode(false);
            setFarmEditMode(false);
        }
    };


    return (
        <div className="layout">
            <div className={`dashboard-header ${sidebarOpen ? "hidden" : "open"}`}>
                <div className="page-title">

                    <div className="page-title-text">  <h1>{t("profile.title")}</h1></div>

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
                                color: "#fff",
                                fontSize: "16px",
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
            <div className="profile-container">
                {/* Personal Details */}
                <div className="profile-card">
                    <div className="profile-header">
                        <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-pic" />
                        {personalEditMode && <input type="file" accept="image/*" onChange={handleImageChange} />}
                        <div className="profile-info">
                            {personalEditMode ? (
                                <>
                                    <input className="edit-input" placeholder={t("profile.name")} type="text" name="name" value={updatedData.name} onChange={handleInputChange} />
                                    <input className="edit-input" placeholder={t("profile.email")} type="email" name="email" value={updatedData.email} onChange={handleInputChange} />
                                    <p><strong>{t("profile.role")}:</strong> {userData?.role}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>{t("profile.name")}:</strong> {userData?.name}</p>
                                    <p><strong>{t("profile.email")}:</strong> {userData?.email}</p>
                                    <p><strong>{t("profile.role")}:</strong> {userData?.role}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="edit-button" onClick={() => personalEditMode ? handleSubmit() : setPersonalEditMode(true)}>
                            {personalEditMode ? t("profile.save") : t("profile.edit")}
                        </button>

                        {personalEditMode && (
                            <button className="cancel-button" onClick={resetChanges}>
                                {t("profile.cancel")}
                            </button>
                        )}
                    </div>

                </div>

                {/* Farm Details */}
                <div className="profile-card">
                    <div className="profile-info">
                        <h3>{t("profile.farmdetails")}</h3>
                        {farmEditMode ? (
                            <>
                                <input placeholder="Farm Name" className="edit-input" type="text" name="farmname" value={updatedData.farmname} onChange={handleInputChange} />
                                <input placeholder="Farm Location" className="edit-input" type="text" name="farmlocation" value={updatedData.farmlocation} onChange={handleInputChange} />
                                <input placeholder="Farm Phone" className="edit-input" type="text" name="farmphone" value={updatedData.farmphone} onChange={handleInputChange} />
                            </>
                        ) : (
                            <>
                                <p><strong>{t("profile.farmName")}:</strong> {userData?.farmname}</p>
                                <p><strong>{t("profile.farmLocation")}:</strong> {userData?.farmlocation}</p>
                                <p><strong>{t("profile.farmPhone")}:</strong> {userData?.farmphone}</p>
                            </>
                        )}
                    </div>
                    <div className="button-group">
                        <button className="edit-button" onClick={() => farmEditMode ? handleSubmit() : setFarmEditMode(true)}>
                            {farmEditMode ? t("profile.save") : t("profile.edit")}
                        </button>

                        {farmEditMode && (
                            <button className="cancel-button" onClick={resetChanges}>
                                {t("profile.cancel")}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>

    );
}
