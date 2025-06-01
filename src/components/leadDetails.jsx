import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import axios from "axios";
import { API_GET_LEAD, API_GET_USERS } from "../apiConfig"; // Import the API endpoints
import PersonPinIcon from "@mui/icons-material/PersonPin";

function LeadDetails({ leadId }) {
  const [lead, setLead] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await axios.get(`${API_GET_LEAD}/${leadId}`);
        setLead(response.data);
      } catch (err) {
        setError("Failed to fetch lead details");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_GET_USERS);
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    fetchLeadDetails();
    fetchUsers();
  }, [leadId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!lead) {
    return <p>Loading...</p>;
  }

  // Create a map of user IDs to usernames
  const userMap = users.reduce((map, user) => {
    map[user.id] = user.username;
    return map;
  }, {});

  const isUninterested = lead.lead_status === "uninterested";

  return (
    <div className="contentItem">
      <div className="box">
        <Typography variant="h5" gutterBottom>
          Customer Details
        </Typography>
        <div className="customerDetails" style={{ color: isUninterested ? "gray" : "black" }}>
          <div className="header">
            <PersonPinIcon />
            <h2>{lead.name}</h2>
            <p>
              <span>
                {isUninterested
                  ? "UNINTERESTED"
                  : lead.assigned_agent_id
                  ? `@${userMap[lead.assigned_agent_id]}`
                  : ""}
              </span>
            </p>
          </div>

          <div className="detailsItem">
            <div className="row">
              <p>
                Phone: <span>{lead.phone_number}</span>
              </p>{" "}
              |
              <p>
                Email: <span>{lead.email}</span>
              </p>
            </div>
            <div className="row">
              <p>
                Budget: <span>RM {lead.budget}</span>
              </p>{" "}
              |
              <p>
                Size: <span>{lead.size}</span>
              </p>
              |
              <p>
                Type: <span>{lead.house_type}</span>
              </p>
            </div>
            <div className="row">
              <p>
                Condition: <span>{lead.house_status}</span>{" "}
              </p>{" "}
              |
              <p>
                Key: <span>{lead.key_status}</span>
              </p>
            </div>
            <div className="row remark">
              <p>Remarks:</p>
              {lead.remark ? (
                <span>{lead.remark}</span>
              ) : (
                <p className="no-info">No info</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;