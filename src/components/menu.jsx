import React from "react";
import logoMain from "../assets/logo_white.png";
import Button from "@mui/material/Button";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import menuConfig from "../components/menuConfig"; // Import the configuration object
import { account } from "../services/appwrite"; // Adjust path as needed

function Menu() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const userRole = localStorage.getItem("userRole"); // Retrieve user role from localStorage

const handleLogout = async () => {
  try {
    await account.deleteSession("current"); // Clean up Appwrite session
  } catch (err) {
    console.warn("Appwrite session cleanup failed:", err.message);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("appwriteUserId"); // optional cleanup
  navigate("/");
};
  return (
    <>
      <div className="logoContainer">
        <img src={logoMain} alt="" />
      </div>
      <div className="menuSectionTop">
        {menuConfig.map((item) => {
          if (item.roles.includes(userRole)) {
            // Check if the menu item should be active
            const isActive =
              item.path === "/main/"
                ? location.pathname === "/main/" // Exact match for dashboard only
                : location.pathname.startsWith(item.path); // Active for all other subpaths

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={isActive ? "navActive" : ""}
              >
                <Button
                  className="menuBtn"
                  variant="text"
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              </NavLink>
            );
          }
          return null;
        })}
      </div>
      <div className="menuSectionBottom">
        <Button
          className="menuBtn"
          variant="text"
          startIcon={<SettingsSuggestIcon />}
        >
          Setting
        </Button>
        <Button
          onClick={handleLogout}
          className="menuBtn"
          variant="text"
          startIcon={<LockIcon />}
        >
          Logout
        </Button>
      </div>
    </>
  );
}

export default Menu;
