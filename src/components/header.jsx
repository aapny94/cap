import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_GET_USER } from "../apiConfig"; // Import the API endpoint

function Header() {
  const location = useLocation();


  const getPageTitle = (path) => {
    switch (true) {
      case /^\/main\/dashboard-1/.test(path):
        return "Dashboard";
      case /^\/main\/dashboard-2/.test(path):
        return "Dashboard";
      case /^\/main\/user-management/.test(path):
        return "User Management";
      case /^\/main\/project-management/.test(path):
        return "Project Management";
      case /^\/main\/leads/.test(path):
        return "Leads";
      case /^\/main\/quotations/.test(path):
        return "Quotations";
      case /^\/main\/services/.test(path):
        return "Services";
      case /^\/main\/settings/.test(path):
        return "Settings";
      case /^\/main\/contract/.test(path):
        return "Contract";
      case /^\/main\/payment-terms/.test(path):
        return "Payment Terms";
      default:
        return "Dashboard";
    }
  };

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const decodedToken = jwtDecode(token); // Decode the token to get the userId
        const userId = decodedToken.userId;
        const response = await axios.get(`${API_GET_USER}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{getPageTitle(location.pathname)}</h1>
      <p>
        Welcome,{" "}
        <strong>
          {user.first_name} {user.last_name}!
        </strong>
      </p>
    </>
  );
}

export default Header;

// here need to comeback for p strong will change depending on the user login username //
