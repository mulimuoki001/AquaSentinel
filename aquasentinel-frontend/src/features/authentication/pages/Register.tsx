// Register.js
import { useState } from 'react';
import { registerUser } from '../authServices/Register';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [farmname, setFarmname] = useState('');
  const [farmlocation, setFarmlocation] = useState('');
  const [farmphone, setFarmphone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  }
  const handleFarmnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFarmname(event.target.value);
  }

  const handleFarmlocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFarmlocation(event.target.value);
  }
  const handleFarmphoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFarmphone(event.target.value);
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    if (role === 'farmer' && (!farmname || !farmlocation || !farmphone)) {
      setError('All farm details must be provided');
      return;
    }
    try {
      const response = await registerUser(
        name,
        email,
        password,
        role,
        farmname,
        farmlocation,
        farmphone
      );

      console.log('Registration successful:', response);
      setError(null);
      setSuccess('Registration successful');
      navigate('/registration-success'); // Redirect to login page after successful registration

      // Redirect to login page or show success message
    } catch (error) {
      setSuccess(null);
      setError((error as Error).message);
    }
  };

  return (
    <div className="registration-container">
      <div className="register-container">
        <h1 className="register-header">Register</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <label>
            Name:
            <input type="text" placeholder="Enter your name e.g Brian Muli" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <br />

          <label>
            Email:
            <input type="email" placeholder="Enter your email address e.g 4eGQW@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <br />
          <label >
            Role:
            <select value={role} onChange={handleRoleChange}>
              <option value="farmer">Farmer</option>
              <option value="provider">Provider</option>
              <option value="RAB">RAB</option>
            </select>

          </label>
          {role === 'farmer' && (
            <>
              <label>
                Farm Name:
                <input type="text" value={farmname} placeholder='Enter your farm name e.g Muli Farm e.g Muli Farm' onChange={handleFarmnameChange} />
              </label>
              <br />
              <label>
                Farm Location:
                <input type="text" value={farmlocation} placeholder='Enter your farm location e.g kayonza' onChange={handleFarmlocationChange} />
              </label>
              <br />
              <label>
                Farm Phone:
                <input type="text" value={farmphone} placeholder='Enter your farm phone number e.g +350791704016' onChange={handleFarmphoneChange} />
              </label>
              <br />
            </>
          )}
          <br />
          <button type="submit">Register</button>
        </form>
        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;