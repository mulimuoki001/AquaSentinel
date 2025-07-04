export const registerUser = async (name: string, email: string, password: string, role: string, farmname: string, farmlocation: string, farmphone: string) => {
    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, email, password, role, farmname, farmlocation, farmphone
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await response.json();
        console.log("Registration successful:", data);
        return data;
    } catch(error) {
        console.error("Registration failed:", error);
        throw error;

    }
};