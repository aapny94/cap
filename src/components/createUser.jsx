import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import { API_POST_REGISTER } from "../apiConfig"; // Import the API endpoint

// List of roles with chess icons
const roles = [{ name: "Director" }, { name: "SalesAgent" }, { name: "Admin" }];

export default function CreateUser({ onUserCreated }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    role: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_POST_REGISTER, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        user_role: formData.role,
      });
      console.log("User Data:", response.data);
      alert("User Created Successfully!");
      onUserCreated(response.data); // Call the callback function with the new user data
    } catch (error) {
      console.error("There was an error creating the user!", error);
      alert("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="contentItem">
      <div className="box">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="off"
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="off"
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="off"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          <TextField
            select
            label="User Role"
            autoComplete="off"
            name="role"
            value={formData.role}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          >
            {roles.map((role, index) => (
              <MenuItem key={index} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            className="userBtn"
            fullWidth
            sx={{ backgroundColor: "black", color: "white", marginTop: 2 }}
          >
            Create User
          </Button>
        </form>
      </div>
    </div>
  );
}