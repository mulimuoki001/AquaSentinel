import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutService from "../../../../authentication/authServices/Logout";
import NavBar from "../../generalComponents/navBar";
import { Notifications } from "./notifications";


const NotificationsLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutService.logout();
        navigate('/login');
      }

  return (
    <div className="layout">
      <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout}/>
        <Notifications sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
    </div>
  );
};

export default NotificationsLayout;