// src/pages/Login.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../authServices/Login';
import { validateToken } from '../authServices/tokenValidation';
const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const checkToken = async () => {
			const { valid, role } = await validateToken();
			if (valid && role) {
				localStorage.setItem('role', role);
				if (role === 'farmer') {
					navigate('/dashboard/farmer');
				} else if (role === 'provider') {
					navigate('/dashboard/provider');
				} else if (role === 'RAB') {
					navigate('/dashboard/RAB');
				}
			}
		}

		checkToken();
	}, []);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError('All fields are required');
			return;
		}
		try {
			const response = await loginUser(email, password);
			console.log('Login successful:', response);
			setError('');
			const token = response.newToken;
			const role = response.role;
			localStorage.setItem('token', token);
			localStorage.setItem('role', role);
			if (role === 'farmer') {
				navigate('/dashboard/farmer');
			} else if (role === 'provider') {
				navigate('/dashboard/provider');
			} else if (role === 'RAB') {
				navigate('/dashboard/RAB');
			}
		} catch (err: any) {
			setError(err.message || 'Login failed');
		}
	};

	return (
		<div className='login-container'>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<label>Email:
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email e.g 7lTl0@example.com"
						required
						className="input-field"
					/>
				</label>
				<label>Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
						className="input-field"
					/>
				</label>
				<div className="login-button-container">
					<button type="submit">Login</button>
				</div>
			</form>
			<div className="login-footer">
				<p>Don't have an account? <a href="/register">Register</a></p>
				{error && <p className="error-message">{error}</p>}
			</div>
		</div>
	);
};

export default Login;
