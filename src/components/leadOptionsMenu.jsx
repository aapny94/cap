import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { API_DELETE_LEAD, API_ASSIGN_AGENT, API_UPDATE_LEAD_UNINTERESTED } from "../apiConfig";
import AssignAgents from "./assignAgents"; // Import the AssignAgents component

function LeadOptionsMenu({ leadId, onDelete, onAssignAgent, onUpdateStatus }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAssignAgents, setShowAssignAgents] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowAssignAgents(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_LEAD}/${leadId}`);
      onDelete(leadId); // Call the onDelete callback with the leadId
      handleClose();
    } catch (error) {
      console.error("There was an error deleting the lead!", error);
      alert("Failed to delete lead. Please try again.");
    }
  };

  const handleAssignAgents = () => {
    setShowAssignAgents(true);
  };

  const handleAssign = async (userId) => {
    try {
      const response = await axios.post(`${API_ASSIGN_AGENT}`, { leadId, agentId: userId });
      console.log("Assigned agent response:", response.data);
      onAssignAgent(leadId, userId); // Call the onAssignAgent callback with the leadId and userId
      handleClose();
    } catch (error) {
      console.error("There was an error assigning the agent!", error);
      alert("Failed to assign agent. Please try again.");
    }
  };

  const handleUninterested = async () => {
    try {
      const response = await axios.post(`${API_UPDATE_LEAD_UNINTERESTED}`, { leadId });
      console.log("Updated lead status to uninterested:", response.data);
      onUpdateStatus(leadId, "uninterested"); // Call the onUpdateStatus callback with the leadId and new status
      handleClose();
    } catch (error) {
      console.error("There was an error updating the lead status!", error);
      alert("Failed to update lead status. Please try again.");
    }
  };

  const userRole = localStorage.getItem("userRole");

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      {!showAssignAgents ? (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          className="menuList"
        >
          <MenuItem>
            <ListItemIcon>
              <RequestQuoteIcon />
            </ListItemIcon>
            <Typography variant="inherit">Create Quotations</Typography>
          </MenuItem>
          {userRole !== "SalesAgent" && (
            <>
              <MenuItem onClick={handleAssignAgents}>
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <Typography variant="inherit">Assign Agents</Typography>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <Typography variant="inherit">Delete</Typography>
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleUninterested}>
            <ListItemIcon>
              <NoAccountsIcon />
            </ListItemIcon>
            <Typography variant="inherit">Uninterested</Typography>
          </MenuItem>
        </Menu>
      ) : (
        <AssignAgents
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleAssign={handleAssign}
        />
      )}
    </div>
  );
}

export default LeadOptionsMenu;