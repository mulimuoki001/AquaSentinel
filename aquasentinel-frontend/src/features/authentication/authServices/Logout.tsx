import axios from 'axios';

const logoutService = {
  async logout() {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post('http://localhost:3000/auth/logout', {}, { headers });
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