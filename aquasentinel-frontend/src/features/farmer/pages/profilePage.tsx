import LogoutPage from '../../authentication/pages/Logout';
import FarmerProfile from '../components/farmerProfile';

const FarmerDashboard = () => {
  return (
    <div>
          <FarmerProfile />
          <LogoutPage />
    </div>
  );
};

export default FarmerDashboard;