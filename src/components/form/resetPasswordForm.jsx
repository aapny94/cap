import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logoMain from "../../assets/logo_white.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { API_UPDATE_PASSWORD } from "../../apiConfig";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_UPDATE_PASSWORD, {
        token,
        password,
      });
      alert("Password reset successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to reset password");
    }
  };

  return (
    <>
      <div className="form">
        <img src={logoMain} alt="" />
        <h2>Reset Password</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleResetPassword}>
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
            Confirm
          </Button>
        </form>
      </div>
    </>
  );
}

export default ResetPasswordForm;