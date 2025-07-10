// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;