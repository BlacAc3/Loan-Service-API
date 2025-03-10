import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Protected = ({ children }) => {
  // Authentication passed, render the protected content
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        <p className="text-white ml-4 text-xl">Loading data...</p>
      </div>
    );
  }
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default Protected;
