// topBar.js
import { Link, useLocation } from "react-router-dom";
import useFarmerData from "../../hooks/farmerData";

interface NavBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  handleLogout: () => void
}
const NavBar: React.FC<NavBarProps> = ({ sidebarOpen, setSidebarOpen, handleLogout}) => {
  const { data, error } = useFarmerData();
  const location = useLocation();

  if (!data) {
    return <div>Loading...</div>;
  } else {
    console.log(error);
  }
  //Todays date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  

  return (
      <div>
          <div className="topBar">
            <div className="topBar-icons">
                    <img className="topBar-logo" src="../../public/Aquasentinel-logo.png" alt="Aquasentinel" />
              {/*Toggle Icons*/}
              {sidebarOpen ? (
                <img
                  className="topBar-close-menu"
                  src="../../public/arrow.png"
              alt="Close Menu" onClick={() => setSidebarOpen(false)}
                />
              ) : (
                <img
                  className="topBar-open-menu-icon"
                  src="../../public/menu-bar.png"
                  alt="Open Menu" onClick={() => setSidebarOpen(true)}
                />
              )}
            </div>
          <div className="topBar-info">
            <div className="location">
                <img src="../../public/Location.png" alt="Location" />
                <p>Kayonza District</p>
            </div>
            <div className="notifications-topBar">
                <img src="../../public/alerts.png" alt="Location" />
                <p>Notifications</p>
            </div>
            <div className="today-date">
                <img src="../../public/calendar.png" alt="Calendar" />
                <p>{formattedDate}</p>
            </div>
              <div className="topBar-profile">
                <img src="../../public/profile-pic.png" alt="Profile" />
                  <p>{data.name}</p>
              </div>
            </div>
          </div>
          <div className={`sidebar ${sidebarOpen ? "open" : "hidden"}`}>            
            <Link to="/dashboard/farmer" className={`sidebar-item ${location.pathname === "/dashboard/farmer" ? "active" : ""}`}>
              <p>Dashboard Overview</p>
        </Link>
        <Link to="/dashboard/farmer/irrigation-history" className={`sidebar-item ${location.pathname === "/dashboard/farmer/irrigation-history" ? "active" : ""}`}>
                    <p>Irrigation History</p>
                </Link>
                <Link to="/dashboard/farmer/smart-recommendations" className={`sidebar-item ${location.pathname === "/dashboard/farmer/smart-recommendations" ? "active" : ""}`}>
                    <p>Smart Farm Recommendations</p>
                </Link>
                <Link to="/dashboard/farmer/export-logs" className={`sidebar-item ${location.pathname === "/dashboard/farmer/export-logs" ? "active" : ""}`}>
                    <p>Export Logs(CSV/PDF)</p>
                </Link>
                <Link to="/dashboard/farmer/notifications" className={`sidebar-item ${location.pathname === "/dashboard/farmer/notifications" ? "active" : ""}`}>
                    <p>Alerts & Notifications</p>
                </Link>
                <Link to="/dashboard/farmer/support-education" className={`sidebar-item ${location.pathname === "/dashboard/farmer/support-education" ? "active" : ""}`}>
                    <p>Support & Education</p>
        </Link>

        <div><br></br>
        <hr></hr>
          <br></br></div>
        <Link to="/dashboard/farmer/farmer-profile" className={`sidebar-item ${location.pathname === "/dashboard/farmer/farmer-profile" ? "active" : ""}`}>
          <img src="../../public/profile-pic.png" alt="Profile" className="profile-icon" />
          <p>Profile</p>
        </Link>
        <Link to="/dashboard/farmer/settings" className={`sidebar-item ${location.pathname === "/dashboard/farmer/settings" ? "active" : ""}`}>
                    <img src="../../public/settings.png" alt="Settings" className="settings-icon"/>
                    <p>Settings</p>
                </Link>
        <Link to="/login" className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`} onClick={handleLogout}>
                    <img src="../../public/logout.png" alt="Logout" className="logout-icon"/>
                    <p>Logout</p>
                </Link>
          </div>
              
          </div>
    );
  };
  
  export default NavBar;
  