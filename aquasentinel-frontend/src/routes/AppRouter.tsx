import { Route, Routes } from 'react-router-dom';
import Login from '../features/authentication/pages/Login';
import Register from '../features/authentication/pages/Register';
import FarmerDashboard from '../features/farmer/pages/profilePage';
import ProviderDashboard from '../features/provider/pages/profilePage';
import RABDashboard from '../features/RAB/pages/profilePage';

const AppRoutes = () => {
    return (
            <Routes>
            <Route path="/login" element={<Login />} />
                <Route path="/" element={<Register />} />
                <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
                <Route path="/dashboard/provider" element={<ProviderDashboard />} />
                <Route path="/dashboard/RAB" element={<RABDashboard />} />
            </Routes>
    )
};

export default AppRoutes;
