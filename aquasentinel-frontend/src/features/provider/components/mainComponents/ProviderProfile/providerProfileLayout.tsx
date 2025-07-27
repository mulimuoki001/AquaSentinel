import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../generalComponents/navBar";
import logoutService from "../../../../authentication/authServices/Logout";
import ProviderProfile from "./providerProfile";

const ProviderProfileLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutService.logout();
        navigate('/login');
    }

    return (
        <div className="layout">
            <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />
            <ProviderProfile sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
        </div>
    );
};

export default ProviderProfileLayout;