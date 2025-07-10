import axios from 'axios';

export const loginUser = async (email: string, password: string): Promise<{ newToken: string, role: string, userId: number }> => {
	const response = await axios.post('/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});
	console.log("Login response:", response);

	if (response.status !== 200) {
		const error: any = await response.data;
		throw new Error(error.message || 'Login failed');
	}
	const data: any = await response.data;
	console.log("Login successful:", data);

	return data;
};