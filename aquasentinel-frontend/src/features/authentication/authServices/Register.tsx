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
    const response = await axios.post('/auth/register', {
        name,
        email,
        password,
        role,
        farmname,
        farmlocation,
        farmphone
    });

    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error('Registration failed');
    }
};
