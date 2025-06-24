import axios from 'axios';
import { useEffect, useState } from 'react';

const useRABData = () => {
  const [data, setData] = useState<{id: number, name: string}[]>([]);
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
            const response = await axios.get('http://localhost:3000/dashboard/RAB');
            const responseData = response.data as { id: number, name: string }[];
            if (Array.isArray(responseData)) {
                setData(responseData);
            }
        } catch (error: any) {
            setError(error);
        }
    };
        fetchData();
  }, []);

  return { data, error };
};

export default useRABData;