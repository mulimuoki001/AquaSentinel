import axios from 'axios';
import api from '../../../utils/axiosInstance';

const logoutService = {
  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        await api.post('/auth/logout', {}, { headers });
        localStorage.removeItem('token');
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export default logoutService;