// import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '../../../utils/axiosInstance';

const useFarmerData = () => {
  const [data, setData] = useState<{ id: number, name: string, role: string, email: string, farmname: string, farmlocation: string, farmphone: string, profile_pic: string | null } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    const fetchData = async () => {
      try {
        const response = await api.get('/users/data');
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