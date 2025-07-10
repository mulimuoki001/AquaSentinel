// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import React from "react";
import { isAuthenticated } from "../utils/authenticated";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
