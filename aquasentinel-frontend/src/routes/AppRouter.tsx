import { Route, Routes } from 'react-router-dom';
import Login from '../features/authentication/pages/Login';
import Register from '../features/authentication/pages/Register';
import ExportLogsLayout from '../features/farmer/components/mainComponents/ExportLogs/exportLogsLayout';
import ProfileLayout from '../features/farmer/components/mainComponents/FarmerProfile/profileLayout';
import IrrigationHistoryLayout from '../features/farmer/components/mainComponents/IrrigationHistory/irrigationHistoryLayout';
import NotificationsLayout from '../features/farmer/components/mainComponents/Notifications/notificationsLayout';
import SettingsLayout from '../features/farmer/components/mainComponents/Settings/settingsLayout';
import SmartRecommendationsLayout from '../features/farmer/components/mainComponents/SmartRecommendations/smartRecommendationsLayout';
import SupportEducationLayout from '../features/farmer/components/mainComponents/SupportEducation/supportEducationLayout';
import FarmerDashboard from '../features/farmer/pages/FarmerDashboard';
import ProviderDashboard from '../features/provider/pages/ProviderDashboard';
import RegistrationSuccess from '../features/authentication/pages/RegistrationSuccessPage';
import RABDashboard from '../features/RAB/pages/RABDashboard';
import LandingPage from '../features/authentication/pages/WelcomePage';
import FarmMonitoringLayout from '../features/provider/components/mainComponents/FarmMonitoring.ts/farmMonitoringLayout';
import PrivateRoute from './privateRoute';
import ProviderIrrigationSessionsLayout from '../features/provider/components/mainComponents/IrrigationSessions/irrigationSessionsLayout';
import ProviderRecommendationsLayout from '../features/provider/components/mainComponents/ProviderRecommendations/recommendationsLayout';
import ProviderAlertsLayout from '../features/provider/components/mainComponents/Alerts/providerAlertsLayout';
import ProviderExportCenterLayout from '../features/provider/components/mainComponents/ExportCenter/providerExportCenterLayout';
import DistrictZoneMonitoringLayout from '../features/RAB/components/mainComponents/DistrictZoneMonitoring/zoneMonitoringLayout';
const AppRoutes = () => {
    return (
        <Routes>
            // Authentication Routes
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            // Farmer Dashboard Routes
            <Route path="/dashboard/farmer/farmer-profile" element={<PrivateRoute><ProfileLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer/support-education" element={<PrivateRoute><SupportEducationLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer/notifications" element={<PrivateRoute><NotificationsLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer/smart-recommendations" element={<PrivateRoute><SmartRecommendationsLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer/settings" element={<PrivateRoute><SettingsLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer/irrigation-history" element={<PrivateRoute><IrrigationHistoryLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer/export-logs" element={<PrivateRoute><ExportLogsLayout /></PrivateRoute>} />
            <Route path="/dashboard/farmer" element={<PrivateRoute><FarmerDashboard /></PrivateRoute>} />
            // Provider  Dashboard Routes
            <Route path="/dashboard/provider" element={<ProviderDashboard />} />
            <Route path="/dashboard/provider/farm-monitoring" element={<PrivateRoute><FarmMonitoringLayout /></PrivateRoute>} />
            <Route path="/dashboard/provider/irrigation-sessions" element={<PrivateRoute><ProviderIrrigationSessionsLayout /></PrivateRoute>} />
            <Route path="/dashboard/provider/recommendations" element={<PrivateRoute><ProviderRecommendationsLayout /></PrivateRoute>} />
            <Route path="/dashboard/provider/alerts" element={<PrivateRoute><ProviderAlertsLayout /></PrivateRoute>} />
            <Route path="/dashboard/provider/export-center" element={<PrivateRoute><ProviderExportCenterLayout /></PrivateRoute>} />

            // RAB Dashboard Routes
            <Route path="/dashboard/RAB" element={<RABDashboard />} />
            <Route path="/dashboard/RAB/district-zone-monitoring" element={<PrivateRoute><DistrictZoneMonitoringLayout /></PrivateRoute>} />
        </Routes>
    )
};

export default AppRoutes;
