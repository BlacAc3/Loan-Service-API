import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const LoginPage = (props) => {
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("signup");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login form state
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated, apiBaseUrl } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear error message when switching tabs
    setError(null);
    setSuccess(null);
  }, [activeTab]);

  useEffect(() => {
    if (props.command === "logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
    if (props.command === "login") {
      setActiveTab("login");
    }
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [setIsAuthenticated, props.command, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const fetchAuthToken = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      // API endpoint for authentication
      const response = await fetch(apiBaseUrl + "/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      // Store tokens in localStorage for persistence
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      // You could also store user info if returned from the API
      // if (data.user) {
      //   localStorage.setItem("user", JSON.stringify(data.user));
      // }

      return data;
    } catch (err) {
      setError(err.message || "Failed to authenticate");
      console.error("Authentication error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiBaseUrl + "/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Registration failed");
      }

      const data = await response.json();
      setSuccess("Registration successful! You can now login.");
      return data;
    } catch (err) {
      setError(err.message || "Failed to register");
      console.error("Registration error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const result = await fetchAuthToken({ username, password });

    if (result) {
      setSuccess("Login successful!");
      // Redirect to dashboard or home page
      setIsAuthenticated(true);
      window.location.href = "/dashboard";
      return;
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!username || !signupPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const result = await register({
      first_name: firstName,
      last_name: lastName,
      username,
      email: signupEmail,
      password: signupPassword,
    });

    if (result) {
      // Clear signup form
      setFirstName("");
      setLastName("");
      setUsername("");
      setSignupEmail("");
      setSignupPassword("");

      // Switch to login tab
      setActiveTab("login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c] text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#0a0a0c] rounded-lg shadow-lg border border-gray-800">
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/50 border border-green-700 rounded text-green-200 text-sm mb-4">
            {success}
          </div>
        )}

        <Tabs.Root
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col"
        >
          <Tabs.List className="flex border-b border-gray-700">
            <Tabs.Trigger
              value="login"
              className="py-2 px-4 w-1/2 text-center data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:text-gray-400 focus:outline-none transition-all duration-300 ease-in-out"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="signup"
              className="py-2 px-4 w-1/2 text-center data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:text-gray-400 focus:outline-none transition-all duration-300 ease-in-out"
            >
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="login"
            className="pt-6 animate-fadeIn"
            style={{
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-white"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onLoad={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onLoad={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </Tabs.Content>

          <Tabs.Content
            value="signup"
            className="pt-6 animate-fadeIn"
            style={{
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-white"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-white"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-white"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="signupEmail"
                  className="block text-sm font-medium text-white"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="signupEmail"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="signupPassword"
                  className="block text-sm font-medium text-white"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="signupPassword"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out focus:scale-[1.01]"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default LoginPage;
