import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../../../../utils/axiosInstance";
import useGlobalContext from "../../../../context/useGlobalContext";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Profile: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const [personalEditMode, setPersonalEditMode] = useState(false);
    const [farmEditMode, setFarmEditMode] = useState(false);
    const { userData } = useGlobalContext();
    const [updatedData, setUpdatedData] = useState({
        name: userData?.name,
        email: userData?.email,
        role: userData?.role,
        farmname: userData?.farmname,
        farmlocation: userData?.farmlocation,
        farmphone: userData?.farmphone,
    });
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
                    <Link to="/dashboard/farmer/support-education"><img src="../../fast-backward.png" className="back-icon" alt="back" /></Link>
                    <h1>Profile</h1>
                    <Link to="/dashboard/farmer/settings"><img src="../../fast-forward.png" alt="forward" /></Link>
                </div>
                <div className="header-nav">
                    <div className="header-profile">
                        <Link to="/dashboard/farmer/farmer-profile"><img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />

                        </Link>
                        <a className="profile-link" href="/dashboard/farmer/farmer-profile">Profile</a>
                    </div>
                    <div className="header-settings">
                        <Link to="/dashboard/farmer/settings"><img className="settings-icon" src="../../Settings.png" alt="Logout" />
                        </Link>
                        <a className="settings-link" href="/dashboard/farmer/settings">Settings</a>
                    </div>
                    <div className="header-logout">
                        <img className="logout-icon" src="../../logout.png" alt="Logout" onClick={handleLogout} />
                        <a className="logout-link" onClick={handleLogout}>Logout</a>
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
                                    <input className="edit-input" placeholder="Name" type="text" name="name" value={updatedData.name} onChange={handleInputChange} />
                                    <input className="edit-input" placeholder="Email" type="email" name="email" value={updatedData.email} onChange={handleInputChange} />
                                    <p><strong>Role:</strong> {userData?.role}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Name:</strong> {userData?.name}</p>
                                    <p><strong>Email:</strong> {userData?.email}</p>
                                    <p><strong>Role:</strong> {userData?.role}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="edit-button" onClick={() => personalEditMode ? handleSubmit() : setPersonalEditMode(true)}>
                            {personalEditMode ? "Save" : "Edit"}
                        </button>

                        {personalEditMode && (
                            <button className="cancel-button" onClick={resetChanges}>
                                Cancel
                            </button>
                        )}
                    </div>

                </div>

                {/* Farm Details */}
                <div className="profile-card">
                    <div className="profile-info">
                        <h3>Farm Details</h3>
                        {farmEditMode ? (
                            <>
                                <input placeholder="Farm Name" className="edit-input" type="text" name="farmname" value={updatedData.farmname} onChange={handleInputChange} />
                                <input placeholder="Farm Location" className="edit-input" type="text" name="farmlocation" value={updatedData.farmlocation} onChange={handleInputChange} />
                                <input placeholder="Farm Phone" className="edit-input" type="text" name="farmphone" value={updatedData.farmphone} onChange={handleInputChange} />
                            </>
                        ) : (
                            <>
                                <p><strong>Farm Name:</strong> {userData?.farmname}</p>
                                <p><strong>Farm Location:</strong> {userData?.farmlocation}</p>
                                <p><strong>Farm Phone:</strong> {userData?.farmphone}</p>
                            </>
                        )}
                    </div>
                    <div className="button-group">
                        <button className="edit-button" onClick={() => farmEditMode ? handleSubmit() : setFarmEditMode(true)}>
                            {farmEditMode ? "Save" : "Edit"}
                        </button>

                        {farmEditMode && (
                            <button className="cancel-button" onClick={resetChanges}>
                                Cancel
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>

    );
}
