import { useNavigate } from 'react-router-dom';
import logoutService from '../authServices/Logout';

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutService.logout();
    navigate('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutPage;