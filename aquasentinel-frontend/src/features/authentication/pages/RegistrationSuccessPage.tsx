
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
  return (
    <div className="success-page">
      <h1>🎉 Registration Successful!</h1>
      <p>You can now log in and start using AquaSentinel Dashboard.</p>
      <Link to="/login">
        <button className="login-button">Go to Login</button>
      </Link>

      <p>OR</p>
      <p>If you want to register another account, click the button below:</p>
      <Link to="/">
        <button className="register-another-button">Register Another Account</button>
      </Link>
    </div>
  );
};

export default RegistrationSuccess;
