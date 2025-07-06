import { Link } from "react-router-dom";
import useFarmerData from "../../../hooks/farmerData";
import { useState } from "react";
interface NavBarProps {
    sidebarOpen: boolean;
    handleLogout: () => void
}
export const Profile: React.FC<NavBarProps> = ({ sidebarOpen, handleLogout }) => {
    const { data } = useFarmerData();
    const [editMode, setEditMode] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        name: data?.name,
        email: data?.email,
        role: data?.role,
        farmname: data?.farmname,
        farmlocation: data?.farmlocation,
        farmphone: data?.farmphone,
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
            formData.append('profileImage', profileImage);
        }
        try {
            const response = await fetch('http://localhost:3000/users/update', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert("Profile updated successfully");
                setEditMode(false);
                console.log('Profile updated successfully');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
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
                        <Link to="/dashboard/farmer/farmer-profile"><img className="profile-icon" src="../../profile-pic.png" alt="Logout" />

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
                        <img src={profileImage ? URL.createObjectURL(profileImage) : "../../profile-pic.png"} alt="Profile" className="profile-avatar" />
                        {editMode && <input type="file" accept="image/*" onChange={handleImageChange} />}
                        <div className="profile-info">
                            {editMode ? (
                                <>
                                    <input className="edit-input" placeholder="Name" type="text" name="name" value={updatedData.name} onChange={handleInputChange} />
                                    <input className="edit-input" placeholder="Email" type="email" name="email" value={updatedData.email} onChange={handleInputChange} />
                                    <p><strong>Role:</strong> {data?.role}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Name:</strong> {data?.name}</p>
                                    <p><strong>Email:</strong> {data?.email}</p>
                                    <p><strong>Role:</strong> {data?.role}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="edit-button" onClick={() => editMode ? handleSubmit() : setEditMode(true)}>{editMode ? "Save" : "Edit"}</button>
                </div>

                {/* Farm Details */}
                <div className="profile-card">
                    <div className="profile-info">
                        <h3>Farm Details</h3>
                        {editMode ? (
                            <>
                                <input type="text" name="farmname" value={updatedData.farmname} onChange={handleInputChange} />
                                <input type="text" name="farmlocation" value={updatedData.farmlocation} onChange={handleInputChange} />
                                <input type="text" name="farmphone" value={updatedData.farmphone} onChange={handleInputChange} />
                            </>
                        ) : (
                            <>
                                <p><strong>Farm Name:</strong> {data?.farmname}</p>
                                <p><strong>Farm Location:</strong> {data?.farmlocation}</p>
                                <p><strong>Farm Phone:</strong> {data?.farmphone}</p>
                            </>
                        )}
                    </div>
                    <button className="edit-button" onClick={() => editMode ? handleSubmit() : setEditMode(true)}>{editMode ? "Save" : "Edit"}</button>
                </div>
            </div>
        </div>

    );
}
