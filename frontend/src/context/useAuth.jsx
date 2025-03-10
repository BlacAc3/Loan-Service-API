import AuthContext from "./AuthContext";
import { useContext } from "react";

const useAuth = () => useContext(AuthContext);

export default useAuth;
