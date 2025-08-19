import React from "react";
import logoMain from "../assets/logo_white.png";
import Button from "@mui/material/Button";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import menuConfig from "../components/menuConfig"; // Import the configuration object

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Local session cleanup
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("appwriteUserId"); // optional cleanup
    navigate("/");
  };

  const userRole = localStorage.getItem("userRole"); // Make sure userRole is defined

  return (
    <>
      <div className="logoContainer">
        <img src={logoMain} alt="" />
      </div>
      <div className="menuSectionTop">
        {menuConfig.map((item) => {
          if (item.roles.includes(userRole)) {
            const isActive =
              item.path === "/main/"
                ? location.pathname === "/main/"
                : location.pathname.startsWith(item.path);

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
