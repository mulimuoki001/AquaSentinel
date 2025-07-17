import withTokenValidation from '../../authentication/hooks/tokenValidationWrapper';
import DashboardOverviewLayout from '../components/mainComponents/DashboardOverview/dashboardOverviewLayout';
const ProviderDashboard = () => {
  return (
    <div>
      <DashboardOverviewLayout />
    </div>
  );
};
const ProviderDashboardWrapped = withTokenValidation(ProviderDashboard);
export default ProviderDashboardWrapped;