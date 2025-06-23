import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { account } from "../services/appwrite"; // Appwrite SDK instance

function Header() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const getPageTitle = (path) => {
    switch (true) {
      case /^\/main\/dashboard-1/.test(path):
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

  useEffect(() => {
    const fetchAppwriteUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user session.");
      }
    };

    fetchAppwriteUser();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  // Get name and split into first/last
  const nameParts = user.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <>
      <h1>{getPageTitle(location.pathname)}</h1>
      <p>
        Welcome,{" "}
        <strong>
          {firstName} {lastName}
        </strong>
        !
      </p>
    </>
  );
}

export default Header;
