import { Link, useLocation } from "react-router-dom";
import useGlobalContext from "../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
import Provider from "/provider.png";
import Farmer from "/farmer.png"
import government from "/government.png";

interface NavBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  handleLogout: () => void
}
const NavBar: React.FC<NavBarProps> = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const { userData } = useGlobalContext();
  const { t } = useTranslation();
  const location = useLocation();
  const { unreadCount } = useGlobalContext();

  //Todays date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let roleIcon: string | { src: string; alt: string };

  switch (userData?.role?.toLowerCase()) {
    case "farmer":
      roleIcon = {
        src: Farmer,
        alt: "Farmer",
      };
      break;
    case "provider":
    case "irrigation service provider":
      roleIcon = {
        src: Provider,
        alt: "Provider",
      };
      break;
    case "rab":
    case "government":
    case "ministry":
      roleIcon = {
        src: government,
        alt: "Government",
      };
      break;
    default:
      roleIcon = "👤";
  }

  return (
    <div>
      <div className="topBar">
        <div className="topBar-icons">
          <Link to="/dashboard/farmer" className={`topBar-logo ${location.pathname === "/dashboard/farmer" ? "active" : ""}`}>
            <img className="topBar-logo" src="../../AquaSentinel-logo.png" alt="Aquasentinel" />
          </Link>
          {/*Toggle Icons*/}
          {sidebarOpen ? (
            <img
              className="topBar-close-menu"
              src="../../arrow.png"
              alt="Close Menu" onClick={() => setSidebarOpen(false)}
            />
          ) : (
            <img
              className="topBar-open-menu-icon"
              src="../../menu-bar.png"
              alt="Open Menu" onClick={() => setSidebarOpen(true)}
            />
          )}
        </div>
        <div className="topBar-info">
          <div className="user-role">
            <div className="tooltip-wrapper">
              {typeof roleIcon === 'object' && roleIcon.src ? (
                <img className="role-icon" src={roleIcon.src} alt={roleIcon.alt} />
              ) : (
                <span></span>
              )}
              <span className="tooltip-sm-screen">
                {(userData?.role ?? "").charAt(0).toUpperCase() + userData?.role?.slice(1)}
              </span>
            </div>
            <span className="role-label">
              {(userData?.role ?? "").charAt(0).toUpperCase() + userData?.role?.slice(1)}
            </span>
          </div>
          <div className="location">
            <img src="../../Location.png" alt="Location" />
            <span>Kayonza {t('nav.district')}</span>
          </div>
          <div className="notifications-topBar">
            <div className="tooltip-wrapper">
              <Link to="/dashboard/farmer/notifications" className={`notification-link ${location.pathname === "/dashboard/farmer/notifications" ? "active" : ""}`}>
                <img src="../../alerts.png" alt="Location" />
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
              </Link>
              <span className="tooltip-sm-screen">
                Alerts
              </span>
            </div>

          </div>
          <div className="today-date">
            {/* <img src="../../calendar.png" alt="Calendar" /> */}
            <p>{formattedDate}</p>
          </div>
          <div className="topBar-profile">
            <div className="tooltip-wrapper">
              <Link to="/dashboard/farmer/farmer-profile" className={`profile-link ${location.pathname === "/dashboard/farmer/farmer-profile" ? "active" : ""}`}>
                <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />
              </Link>
              <span className="tooltip-sm-screen">
                <span>{userData?.name}</span>
              </span>
            </div>
            <span className="profile-name">{userData?.name}</span>
          </div>
        </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : "hidden"}`}>
        <Link to="/dashboard/farmer" className={`sidebar-item ${location.pathname === "/dashboard/farmer" ? "active" : ""}`}>
          <p>{t('nav.dashboard')}</p>
        </Link>
        <Link to="/dashboard/farmer/irrigation-history" className={`sidebar-item ${location.pathname === "/dashboard/farmer/irrigation-history" ? "active" : ""}`}>
          <p>{t('nav.irrigationHistory')}</p>
        </Link>
        <Link to="/dashboard/farmer/smart-recommendations" className={`sidebar-item ${location.pathname === "/dashboard/farmer/smart-recommendations" ? "active" : ""}`}>
          <p>{t('nav.smartFarm')}</p>
        </Link>
        <Link to="/dashboard/farmer/export-logs" className={`sidebar-item ${location.pathname === "/dashboard/farmer/export-logs" ? "active" : ""}`}>
          <p>{t('nav.exportLogs')}</p>
        </Link>
        <Link to="/dashboard/farmer/notifications" className={`sidebar-item ${location.pathname === "/dashboard/farmer/notifications" ? "active" : ""}`}>
          <p>{t('nav.alerts')}</p>
        </Link>
        <Link to="/dashboard/farmer/support-education" className={`sidebar-item ${location.pathname === "/dashboard/farmer/support-education" ? "active" : ""}`}>
          <p>{t('nav.support')}</p>
        </Link>

        <div><br></br>
          <hr></hr>
          <br></br></div>
        <Link to="/dashboard/farmer/farmer-profile" className={`sidebar-item ${location.pathname === "/dashboard/farmer/farmer-profile" ? "active" : ""}`}>
          <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData?.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />
          <p>{t('nav.profile')}</p>
        </Link>
        <Link to="/dashboard/farmer/settings" className={`sidebar-item ${location.pathname === "/dashboard/farmer/settings" ? "active" : ""}`}>
          <img src="../../Settings.png" alt="Settings" className="settings-icon" />
          <p>{t('nav.settings')}</p>
        </Link>
        <Link to="/login" className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`} onClick={handleLogout}>
          <img src="../../logout.png" alt="Logout" className="logout-icon" />
          <p>{t('nav.logout')}</p>
        </Link>
      </div>

    </div >
  );
};

export default NavBar;
