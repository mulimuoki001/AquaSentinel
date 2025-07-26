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
      roleIcon = Farmer;
      break;
    case "provider":
    case "irrigation service provider":
      roleIcon = Provider;
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
          <Link to="/dashboard/RAB" className={`topBar-logo ${location.pathname === "/dashboard/RAB" ? "active" : ""}`}>
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
          <p className="notifications-topBar">
            <div className="tooltip-wrapper">
              <Link to="/dashboard/RAB/alerts" className={`notification-link ${location.pathname === "/dashboard/RAB/notifications" ? "active" : ""}`}>
                <img src="../../alerts.png" alt="Location" />

              </Link>
              <span className="tooltip-sm-screen">
                Alerts
              </span>
            </div>
          </p>
          <div className="today-date">
            {/* <img src="../../calendar.png" alt="Calendar" /> */}
            <p>{formattedDate}</p>
          </div>
          <p className="topBar-profile">
            <div className="tooltip-wrapper">
              <Link to="/dashboard/RAB/provider-profile" className={`profile-link ${location.pathname === "/dashboard/RAB/farmer-profile" ? "active" : ""}`}>
                <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />
              </Link>
              <span className="tooltip-sm-screen">
                <span>{userData?.name}</span>
              </span>
            </div>
            <span className="profile-name">{userData?.name}</span>
          </p>
        </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : "hidden"}`}>
        <Link to="/dashboard/RAB" className={`sidebar-item ${location.pathname === "/dashboard/RAB" ? "active" : ""}`}>
          <p>{t('rab.nationalOverview')}</p>
        </Link>
        <Link to="/dashboard/RAB/district-zone-monitoring" className={`sidebar-item ${location.pathname === "/dashboard/RAB/district-monitoring-zone" ? "active" : ""}`}>
          <p>{t('rab.districtMonitoring')}</p>
        </Link>
        <Link to="/dashboard/RAB/live-alerts" className={`sidebar-item ${location.pathname === "/dashboard/RAB/live-alerts" ? "active" : ""}`}>
          <p>{t('rab.liveAlerts')}</p>
        </Link>
        <Link to="/dashboard/RAB/compliance-reports" className={`sidebar-item ${location.pathname === "/dashboard/RAB/compliance-reports" ? "active" : ""}`}>
          <p>{t('rab.complianceReports')}</p>
        </Link>
        <Link to="/dashboard/RAB/recommendations-policy-insights" className={`sidebar-item ${location.pathname === "/dashboard/RAB/recommendations-policy-insights" ? "active" : ""}`}>
          <p>{t('rab.policyInsights')}</p>
        </Link>

        <div><br></br>
          <hr></hr>
          <br></br></div>

        <Link to="/dashboard/RAB/admin-settings" className={`sidebar-item ${location.pathname === "/dashboard/RAB/admin-settings" ? "active" : ""}`}>
          <img src="../../Settings.png" alt="Settings" className="settings-icon" />
          <p>{t('rab.adminSettings')}</p>
        </Link>
        <Link to="/login" className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`} onClick={handleLogout}>
          <img src="../../logout.png" alt="Logout" className="logout-icon" />
          <p>{t('provider.logout')}</p>
        </Link>
      </div>

    </div >
  );
};

export default NavBar;
