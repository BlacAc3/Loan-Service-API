import { useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const token = localStorage.getItem("accessToken");
  fetch("http://localhost:8000/api/auth/user/", {
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
      console.log(isAuthenticated);
      return !!isAuthenticated;
    })
    // .then((userData) => {
    //   console.log("User data:", userData);
    //   // You can store user data in state or context here
    // })
    .catch((error) => {
      setIsAuthenticated(false);
      console.error("Error fetching user data:", error);
      return !!isAuthenticated;
    });
};

export { useAuth };
