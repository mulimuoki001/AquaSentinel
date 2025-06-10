import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import "../src/features/authentication/pages/css/Login.css";
import "../src/features/authentication/pages/css/Register.css";
import AppRoutes from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;