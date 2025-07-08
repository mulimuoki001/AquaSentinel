export const loginUser = async (email: string, password: string): Promise<{ newToken: string, role: string, userId: number }> => {
	const response = await fetch('/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});
	console.log("Login response:", response);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Login failed');
	}

	return response.json();
};