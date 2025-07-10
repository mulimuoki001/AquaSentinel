import api from "../../../utils/axiosInstance";

export const registerUser = async (name: string, email: string, password: string, role: string, farmname: string, farmlocation: string, farmphone: string) => {
    try {
        const response = await api.post('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, email, password, role, farmname, farmlocation, farmphone
            })
        });

        if (response.status !== 200) {
            const error: any = await response.data;
            throw new Error(error.message || 'Registration failed');
        }

        const data: any = await response.data;
        console.log("Registration successful:", data);
        return data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;

    }
};