export const validateToken = async (): Promise<{
  valid: boolean;
  role?: string;
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return { valid: false };
    } else {
      const response = await fetch(
        "http://localhost:3000/auth/validate-token",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          return { valid: false, error: "Unauthorized" };
        } else {
          return { valid: false, error: "Failed to validate token" };
        }
      } else {
        try {
          const data = await response.json();
          console.log("Token validation response:", data);
          return {
            valid: data.valid,
            role: data.role,
            error: data.error,
          };
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          return { valid: false, error: "Failed to parse response as JSON" };
        }
      }
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return { valid: false, error: "Error validating token" };
  }
};
