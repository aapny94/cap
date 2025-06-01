import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { API_GET_USERS } from "../apiConfig"; // Import the API endpoint

function AssignAgents({ anchorEl, handleClose, handleAssign }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_GET_USERS);
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        className="menuList"
        style={{ zIndex: 1 }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <Typography variant="inherit">Cancel</Typography>
        </MenuItem>
        {error && <Typography color="error">{error}</Typography>}
        {users.map((user) => (
          <MenuItem key={user.id} onClick={() => handleAssign(user.id)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <Typography variant="inherit">{user.username}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default AssignAgents;