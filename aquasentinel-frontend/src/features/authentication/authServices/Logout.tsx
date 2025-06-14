import axios from 'axios';

const logoutService = {
  async logout() {
        try {
          const token = localStorage.getItem('token');
          localStorage.removeItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post('/auth/logout', {}, { headers });
    } catch (error) {
      console.error(error);
    }
  },
};

export default logoutService;