import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '../../../utils/axiosInstance';

const useRABData = () => {
    const [data, setData] = useState<{ id: number, name: string }[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/RAB');
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

export default useRABData;