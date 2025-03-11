import { useEffect } from "react";
import { useState } from "react";
import AuthContext from "./AuthContext";

// Create the AuthContext

// Provide context globally
const AuthProvider = ({ children }) => {
  const [loading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const apiBaseUrl = "https://loan-service-api.vercel.app";
  const apiBaseUrl = "http://localhost:8000";
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
    }
    fetch(apiBaseUrl + "/api/auth/user/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        setIsAuthenticated(true);
      })
      // .then((userData) => {
      //   console.log("User data:", userData);
      //   // You can store user data in state or context here
      // })
      .catch((error) => {
        setIsAuthenticated(false);
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, apiBaseUrl]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading, apiBaseUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the context

export default AuthProvider;
