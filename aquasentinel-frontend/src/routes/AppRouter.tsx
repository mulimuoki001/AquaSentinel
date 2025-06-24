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
import RABDashboard from '../features/RAB/pages/RABDashboard';

const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Register />} />
                <Route path="/dashboard/farmer/farmer-profile" element={<ProfileLayout />} />
                <Route path="/dashboard/farmer/support-education" element={<SupportEducationLayout />} />
                <Route path="/dashboard/farmer/notifications" element={<NotificationsLayout />} />
                <Route path="/dashboard/farmer/smart-recommendations" element={<SmartRecommendationsLayout />} />
                <Route path="/dashboard/farmer/settings" element={<SettingsLayout />} />
                <Route path="/dashboard/farmer/irrigation-history" element={<IrrigationHistoryLayout />} />
                <Route path="/dashboard/farmer/export-logs" element={<ExportLogsLayout />} />
                <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
                <Route path="/dashboard/provider" element={<ProviderDashboard />} />
                <Route path="/dashboard/RAB" element={<RABDashboard />} />
            </Routes>
    )
};

export default AppRoutes;
