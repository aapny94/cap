import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import LockResetIcon from "@mui/icons-material/LockReset";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_CHANGE_USER_STATUS, API_DELETE_USER, API_RESET_PASSWORD } from "../apiConfig"; // Import the API endpoint

const UserOptionsMenu = ({ userId, userStatus, onStatusChange, onDelete, onEditUser, isEditing, onCancelEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = async () => {
    try {
      const newStatus = !userStatus;
      console.log(`Changing status for user ${userId} to ${newStatus}`);
      const response = await axios.post(API_CHANGE_USER_STATUS, {
        id: userId,
        status: newStatus,
      });
      console.log('Response:', response.data);
      onStatusChange(userId, newStatus);
      handleClose();
    } catch (error) {
      console.error("Failed to change user status", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      console.log(`Deleting user ${userId}`);
      await axios.delete(`${API_DELETE_USER}/${userId}`);
      onDelete(userId);
      handleClose();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      console.log(`Resetting password for user ${userId}`);
      const response = await axios.post(API_RESET_PASSWORD, { id: userId });
      const resetLink = response.data.resetLink;
      console.log('Reset Link:', resetLink);
      window.open(resetLink, '_blank'); // Open the reset link in a new tab
      handleClose();
    } catch (error) {
      console.error("Failed to reset password", error);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        className="menuList"
      >
        <MenuItem onClick={handleChangeStatus}>
          <ListItemIcon>
            <BlockIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {userStatus ? "Suspend" : "Unsuspend"}
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleResetPassword}>
          <ListItemIcon>
            <LockResetIcon />
          </ListItemIcon>
          <Typography variant="inherit">Reset Password</Typography>
        </MenuItem>
        {isEditing ? (
          <MenuItem onClick={onCancelEdit}>
            <ListItemIcon>
              <CancelIcon />
            </ListItemIcon>
            <Typography variant="inherit">Cancel Edit</Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={onEditUser}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <Typography variant="inherit">Edit User</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <Typography variant="inherit">Delete Account</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserOptionsMenu;