import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenWithExpiration, checkTokenExpirationAndRefresh } from "./tokenUtils"; // Import the utility function

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenWithExpiration("token");
    if (!token) {
      navigate("/"); // Redirect to login if token is expired or not found
    } else {
      checkTokenExpirationAndRefresh("token"); // Check token expiration and set refresh
    }
  }, [navigate]);
};

export default useAuth;