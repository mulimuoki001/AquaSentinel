// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import React from "react";
import { isAuthenticated } from "../features/authentication/utils/authenticated";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
