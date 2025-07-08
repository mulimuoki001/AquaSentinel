import axios from 'axios';
import { useEffect, useState } from 'react';

const useFarmerData = () => {
  const [data, setData] = useState<{ id: number, name: string, role: string, email: string, farmname: string, farmlocation: string, farmphone: string, profile_pic: string | null } | null>(null);
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
        const response = await axios.get('/users/data');
        const responseData = response.data as { id: number, name: string, role: string, email: string, farmname: string, farmlocation: string, farmphone: string, profile_pic: string | null } | null;
        setData(responseData);
      } catch (error: any) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return { data, error };
};


export default useFarmerData;