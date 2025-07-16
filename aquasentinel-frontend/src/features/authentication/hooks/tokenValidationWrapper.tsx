import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoutService from '../authServices/Logout';
import useTokenValidation from './tokenValidationHook';

const withTokenValidation = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const TokenValidationWrapper: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const { isValid, error } = useTokenValidation();

    useEffect(() => {
      if (error === "Unauthorized") {
        console.log("isValid:", isValid);
        logoutService.logout();
        navigate('/login');
      }
      else {
        console.log("isValid:", isValid);
        console.log("error:", error);
      }
    }, [error, navigate, isValid]);

    return <WrappedComponent {...props} />;
  };

  return TokenValidationWrapper;
};

export default withTokenValidation;