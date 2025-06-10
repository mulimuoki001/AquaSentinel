export const validateToken = async (): Promise<{
  valid: boolean;
  role?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { valid: false };
    }
    const response = await fetch("http://localhost:3000/auth/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return { valid: data.valid, role: data.role };
  } catch {
    return { valid: false };
  }
};
