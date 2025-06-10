import ProviderProfile from '../components/providerProfile';
import LogoutPage from '../../authentication/pages/Logout';

const ProviderDashboard = () => {
  return (
    <div>
          <ProviderProfile />
          <LogoutPage />
    </div>
  );
};

export default ProviderDashboard