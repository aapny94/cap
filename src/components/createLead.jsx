import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import { API_POST_LEAD } from "../apiConfig"; // Import the API endpoint

const key_status = [{ name: "Yes" }, { name: "No" }];
const house_status = [{ name: "Old" }, { name: "New" }];
const house_type = [{ name: "building" }, { name: "landed" }];

function CreateLead({ onLeadCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    budget: "",
    size: "",
    house_type: "",
    house_status: "",
    key_status: "",
    remark: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRole = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");

      console.log("userRole:", userRole);
      console.log("userId:", userId);

      const leadData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        budget: formData.budget,
        size: formData.size,
        house_type: formData.house_type,
        house_status: formData.house_status,
        key_status: formData.key_status,
        remark: formData.remark,
      };

      if (userRole === "SalesAgent") {
        leadData.assigned_agent_id = userId;
        console.log("Assigned Agent ID:", userId); // Log the assigned agent ID
      }

      console.log("Request Payload:", leadData); // Log the request payload

      const response = await axios.post(API_POST_LEAD, leadData);
      console.log("Lead Data:", response.data);
      alert("Lead Created Successfully!");
      onLeadCreated(response.data); // Call the callback function with the new lead data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Customer already exists, Please check email or phone number");
      } else {
        console.error("There was an error creating the lead!", error);
        alert("Failed to create lead. Please try again.");
      }
    }
  };

  return (
    <div className="contentItem">
      <div className="box">
        <Typography variant="h5" gutterBottom>
          Create Lead
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="formCreateLead">
            <div className="formLeft">
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="budget"
                label="Budget"
                value={formData.budget}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="size"
                label="Size"
                value={formData.size}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </div>

            <div className="formRight">
              <TextField
                select
                autoComplete="off"
                name="house_type"
                label="House Type"
                value={formData.house_type}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {house_type.map((house_type, index) => (
                  <MenuItem key={index} value={house_type.name}>
                    {house_type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                autoComplete="off"
                name="house_status"
                label="House Status"
                value={formData.house_status}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {house_status.map((house_status, index) => (
                  <MenuItem key={index} value={house_status.name}>
                    {house_status.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                autoComplete="off"
                name="key_status"
                label="Key Collected"
                value={formData.key_status}
                onChange={handleChange}
                fullWidth
              >
                {key_status.map((key_status, index) => (
                  <MenuItem key={index} value={key_status.name}>
                    {key_status.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                multiline
                maxRows={10}
                rows={6}
                name="remark"
                label="Remark"
                value={formData.remark}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            className="userBtn"
            fullWidth
            sx={{ backgroundColor: "black", color: "white", marginTop: 2 }}
          >
            Create Lead
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateLead;