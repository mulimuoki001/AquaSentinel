import axios from 'axios';

export const loginUser = async (email: string, password: string): Promise<{ newToken: string, role: string, userId: number }> => {
	const response = await axios.post(
		'https://aquasentinel-dashboard.up.railway.app/auth/login',
		{ email, password },
		{ headers: { 'Content-Type': 'application/json' } }
	);
	const data: any = await response.data;
	return data;
};
