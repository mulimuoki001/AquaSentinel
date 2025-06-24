import withTokenValidation from '../../authentication/hooks/tokenValidationWrapper';
import LogoutPage from '../../authentication/pages/Logout';
import RABProfile from '../components/RABProfile';
const RABDashboard = () => {
  return (
    <div>
          <RABProfile />
          <LogoutPage />
    </div>
  );
};

export default withTokenValidation(RABDashboard);