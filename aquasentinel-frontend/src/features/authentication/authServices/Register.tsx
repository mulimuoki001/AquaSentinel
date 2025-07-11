import axios from 'axios';

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: string,
    farmname: string,
    farmlocation: string,
    farmphone: string
) => {
    try {
        const response = await axios.post('/auth/register', {
            name,
            email,
            password,
            role,
            farmname,
            farmlocation,
            farmphone
        });

        console.log("Registration successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Registration failed:", error?.response?.data || error.message);
        throw error;
    }
};
