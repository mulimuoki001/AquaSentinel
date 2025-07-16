import axios from 'axios';

export const loginUser = async (email: string, password: string): Promise<{ newToken: string, role: string, userId: number }> => {
	const response = await axios.post(
		'/auth/login',
		{ email, password },
		{ headers: { 'Content-Type': 'application/json' } }
	);
	const data: unknown = await response.data;
	return data as { newToken: string, role: string, userId: number };
};
