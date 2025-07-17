import withTokenValidation from '../../authentication/hooks/tokenValidationWrapper';
import DashboardOverviewLayout from '../components/mainComponents/DashboardOverview/dashboardOverviewLayout';
const RABDashboard = () => {
  return (
    <div>
      <DashboardOverviewLayout />
    </div>
  );
};
const RABDashboardWrapped = withTokenValidation(RABDashboard);
export default RABDashboardWrapped;