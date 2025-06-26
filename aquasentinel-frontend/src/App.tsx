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
import "../src/features/authentication/pages/CSS/RegistrationSuccess.css";
import "../src/features/authentication/pages/CSS/WelcomePage.css";
import AppRoutes from './routes/AppRouter';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;