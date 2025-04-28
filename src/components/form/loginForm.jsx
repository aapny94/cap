import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoMain from "../../assets/logo_white.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { API_POST_LOGIN } from "../../apiConfig";
import { setTokenWithExpiration, removeToken } from "../../tokenUtils";

function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = () => {
      removeToken("token");
      removeToken("userRole");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_POST_LOGIN, {
        identifier,
        password,
      });
      const { token, user_role, user_id } = response.data; // Assuming user_id is returned in the response
      localStorage.setItem("userRole", user_role); // Store user role in localStorage
      localStorage.setItem("userId", user_id); // Store user id in localStorage
      setTokenWithExpiration("token", token, 6); // Set token with 6 hours expiration
      navigate("/main/");
    } catch (err) {
      setError("Invalid username/email or password");
    }
  };

  return (
    <>
      <div className="form">
        <img src={logoMain} alt="" />
        <h2>Sign In</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <TextField
            className="inputLogin"
            id="outlined-basic"
            label="Username "
            variant="outlined"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            type="password"
            className="inputLogin"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="btnLogin" variant="contained" type="submit">
            Sign In
          </Button>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
