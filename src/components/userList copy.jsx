import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

import UserOptionsMenu from "./userOptionsMenu";
import { API_UPDATE_USER } from "../apiConfig"; // Import the API endpoint

// Define the roles with their corresponding icons
const roles = [
  { name: "Director", icon: "♔" },
  { name: "SalesAgent", icon: "♞" },
  { name: "Admin", icon: "♜" },
  { name: "SuperAdmin", icon: "♟" },
];

// Custom styled component for list item
const StyledListItem = styled(ListItem)(({ theme, banned }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: banned ? "#ffcccc" : theme.palette.background.paper,
  marginBottom: theme.spacing(1),
}));

function UserList({ users, setUsers, onStatusChange, onDelete }) {
  const [editMode, setEditMode] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleEditUser = (user) => {
    setEditMode(user.id);
    setEditFormData({
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      role: user.user_role,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (userId) => {
    try {
      const response = await axios.put(`${API_UPDATE_USER}/${userId}`, {
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        username: editFormData.username,
        email: editFormData.email,
        user_role: editFormData.role,
      });
      console.log("User updated:", response.data);
      setEditMode(null);
      setSnackbarOpen(true);
      // Update the user list with the updated user data
      const updatedUsers = users.map((user) =>
        user.id === userId ? response.data : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="contentItem flexOveride2">
      <h2>User List</h2>
        <List className="listMui">
        {users.map((user, index) => {
          const role = roles.find((r) => r.name === user.user_role);
          return (
            <StyledListItem
              key={index}
              banned={user.status ? undefined : "true"}
              className="listItem"
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: "lightgray",
                    color: "black",
                    fontSize: 30,
                    padding: 0.5,
                    marginRight: 2,
                  }}
                >
                  {role ? role.icon : "?"}{" "}
                  {/* Display the icon based on the user role */}
                </Avatar>
              </ListItemAvatar>
              {editMode === user.id ? (
                <div className="editUserForm">
                  <form action="">
                    <div>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                      />
                    </div>
                    <div>
                      <TextField
                        label="Username"
                        name="username"
                        value={editFormData.username}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        label="Email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                      />
                    </div>
                    <div>
                      <TextField
                        select
                        label="User Role"
                        name="role"
                        value={editFormData.role}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                      >
                        {roles.map((role, index) => (
                          <MenuItem key={index} value={role.name}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>

                    <Button
                      variant="contained"
                      className="userBtn"
                      onClick={() => handleUpdateUser(user.id)}
                    >
                      Update
                    </Button>

                  </form>
                </div>
              ) : (
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" className="name">
                      {user.first_name} {user.last_name}{" "}
                      <Typography
                        component="span"
                        fontStyle="italic"
                        color="text.secondary"
                      >
                        ({user.user_role}){" "}
                        {user.status ? "" : "| (User Banned!)"}
                      </Typography>
                    </Typography>
                  }
                  secondary={`@${user.username} | ${user.email}`}
                />
              )}
              <UserOptionsMenu
                userId={user.id}
                userStatus={user.status}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onEditUser={() => handleEditUser(user)}
                isEditing={editMode === user.id}
                onCancelEdit={handleCancelEdit}
              />
            </StyledListItem>
          );
        })}
      </List>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          User updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserList;