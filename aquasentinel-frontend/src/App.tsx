import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import "../src/features/authentication/pages/css/Login.css";
import "../src/features/authentication/pages/css/Register.css";
import "../src/features/farmer/components/generalComponents/CSS/navBar.css";
import "../src/features/farmer/components/mainComponents/CSS/dashboardOverview.css";
import "../src/features/farmer/components/mainComponents/CSS/exportLogs.css";
import "../src/features/farmer/components/mainComponents/CSS/irrigationHistory.css";
import "../src/features/farmer/components/mainComponents/CSS/notifications.css";
import "../src/features/farmer/components/mainComponents/CSS/profile.css";
import "../src/features/farmer/components/mainComponents/CSS/settings.css";
import "../src/features/farmer/components/mainComponents/CSS/smartRecommendations.css";
import "../src/features/farmer/components/mainComponents/CSS/supportEducation.css";
import "../src/features/authentication/pages/css/RegistrationSuccess.css";
import "../src/features/authentication/pages/css/WelcomePage.css";
import "../src/features/provider/components/mainComponents/CSS/providerDashboard.css";
import "../src/features/provider/components/mainComponents/CSS/farmMonitoring.css";
import "../src/features/provider/components/mainComponents/CSS/exportCenter.css";
import "../src/features/provider/components/mainComponents/CSS/providerAlerts.css";
import "../src/features/RAB/components/mainComponents/CSS/nationalOverview.css";
import "../src/features/RAB/components/mainComponents/CSS/zoneMonitoring.css";
import AppRoutes from './routes/AppRouter';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;