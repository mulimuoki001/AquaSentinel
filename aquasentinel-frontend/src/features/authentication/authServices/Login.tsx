import axios from 'axios';
interface LoginResponse {
	newToken: string;
	role: string;
	userId: number;
}
export const loginUser = async (email: string, password: string): Promise<{ newToken: string, role: string, userId: number }> => {
	const response = await axios.post(
		'/auth/login',
		{ email, password },
		{ headers: { 'Content-Type': 'application/json' } }
	);
	const data = await response.data as LoginResponse;
	localStorage.setItem('token', data.newToken);
	console.log("Login response:", data);
	return data;
};
