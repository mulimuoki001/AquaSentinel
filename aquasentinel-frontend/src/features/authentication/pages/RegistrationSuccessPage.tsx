
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
  return (
    <div className="success-page">
      <h1>🎉 Registration Successful!</h1>
      <p>You can now log in and start using the AquaSentinel Dashboard.</p>
      <div className="button-group">
        <Link to="/login">
          <button className="login-button">Go to Login</button>
        </Link>

        <span className="or-text">OR</span>


        <Link to="/register">
          <button className="register-another-button">Register Another Account</button>
        </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
