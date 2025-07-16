import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '../../../utils/axiosInstance';

const useProviderData = () => {
    const [data, setData] = useState<{ id: number, name: string }[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Current token:", token);
        if (!token) {
            console.error('Token not found');
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/provider');
                const responseData = response.data as { id: number, name: string }[];
                if (Array.isArray(responseData)) {
                    setData(responseData);
                }
            } catch (error: unknown) {
                setError(error as Error);
            }
        };
        fetchData();
    }, []);

    return { data, error };
};

export default useProviderData;