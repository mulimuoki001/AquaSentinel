import withTokenValidation from '../../authentication/hooks/tokenValidationWrapper';
import LogoutPage from '../../authentication/pages/Logout';
import ProviderProfile from '../components/providerProfile';

const ProviderDashboard = () => {
  return (
    <div>
          <ProviderProfile />
          <LogoutPage />
    </div>
  );
};

export default withTokenValidation(ProviderDashboard);