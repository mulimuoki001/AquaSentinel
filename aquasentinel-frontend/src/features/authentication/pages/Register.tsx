// Register.js
import axios from 'axios';
import { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!email || !password || !role){
      setError('All fields are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
        role,
      });

      console.log('Registration successful:', response);
      // Redirect to login page or show success message
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-header">Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <label>
          Role:
          <select value={role} onChange={(event) => setRole(event.target.value)} className="form-select">
            <option value="farmer">farmer</option>
            <option value="provider">provider</option>
            <option value="RAB">RAB</option>
          </select>
        </label>
        <br />
        <button type="submit">Register</button>
          </form>
          <div className="register-footer">
              <p>Already have an account? <a href="/">Login</a></p>
              {error && <p className="error-message">{error}</p>}
  			</div>
    </div>
  );
};

export default RegisterPage;