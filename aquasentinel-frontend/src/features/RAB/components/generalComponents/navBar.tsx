import { Link, useLocation } from "react-router-dom";
import useGlobalContext from "../../../context/useGlobalContext";
import { useTranslation } from "react-i18next";
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

          <div className="notifications-topBar">
            <Link to="/dashboard/RAB/notifications" className={`notification-link ${location.pathname === "/dashboard/RAB/notifications" ? "active" : ""}`}>
              <img src="../../alerts.png" alt="Location" />
              {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            </Link>
          </div>
          <div className="today-date">
            {/* <img src="../../calendar.png" alt="Calendar" /> */}
            <p>{formattedDate}</p>
          </div>
          <div className="topBar-profile">
            <Link to="/dashboard/RAB/provider-profile" className={`profile-link ${location.pathname === "/dashboard/RAB/farmer-profile" ? "active" : ""}`}>
              <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />
            </Link>
            <p>{userData?.name}</p>
          </div>
        </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : "hidden"}`}>
        <Link to="/dashboard/RAB" className={`sidebar-item ${location.pathname === "/dashboard/RAB" ? "active" : ""}`}>
          <p>{t('rab.nationalOverview')}</p>
        </Link>
        <Link to="/dashboard/RAB/district-monitoring" className={`sidebar-item ${location.pathname === "/dashboard/RAB/district-monitoring" ? "active" : ""}`}>
          <p>{t('rab.districtMonitoring')}</p>
        </Link>
        <Link to="/dashboard/RAB/live-alerts" className={`sidebar-item ${location.pathname === "/dashboard/RAB/live-alerts" ? "active" : ""}`}>
          <p>{t('rab.liveAlerts')}</p>
        </Link>
        <Link to="/dashboard/RAB/compliance-reports" className={`sidebar-item ${location.pathname === "/dashboard/RAB/compliance-reports" ? "active" : ""}`}>
          <p>{t('rab.complianceReports')}</p>
        </Link>
        <Link to="/dashboard/RAB/policy-and-regulations" className={`sidebar-item ${location.pathname === "/dashboard/RAB/policy-and-regulations" ? "active" : ""}`}>
          <p>{t('rab.policyInsights')}</p>
        </Link>
        <Link to="/dashboard/RAB/export-reports" className={`sidebar-item ${location.pathname === "/dashboard/RAB/export-reports" ? "active" : ""}`}>
          <p>{t('rab.exportReports')}</p>
        </Link>


        <div><br></br>
          <hr></hr>
          <br></br></div>
        {/* <Link to="/dashboard/RAB/provider-profile" className={`sidebar-item ${location.pathname === "/dashboard/RAB/provider-profile" ? "active" : ""}`}>
          <img src={userData?.profile_pic ? `/uploads/${encodeURIComponent(userData?.profile_pic)}` : "../../profile-pic.png"} alt="Profile" className="profile-icon" />
          <p>{t('provider.profile')}</p>
        </Link> */}
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
