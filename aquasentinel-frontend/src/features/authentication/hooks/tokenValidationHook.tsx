import { useEffect, useState } from 'react';
import { validateToken } from '../authServices/tokenValidation';

const useTokenValidation = () => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const validateTokenInterval = setInterval(async () => {
      const tokenValidationResult = await validateToken();
      const validationStatus = tokenValidationResult.valid;
      const errorMessage = tokenValidationResult.error || 'No error';
      setIsValid(validationStatus);
      setError(errorMessage);
    }, 6900000); // 1 hour 55 minutes
    return () => clearInterval(validateTokenInterval);
  }, []);

  return { isValid,  error };
};

export default useTokenValidation;