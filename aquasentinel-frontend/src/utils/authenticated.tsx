// utils/checkAuth.ts
import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token) as { exp: number };
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (err) {
        console.error("Invalid token", err);
        return false;
    }
};
