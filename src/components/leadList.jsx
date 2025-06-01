import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/system";
import LeadOptionsMenu from "./LeadOptionsMenu";

// Custom styled component for list item
const StyledListItem = styled(ListItem)(({ theme, selected, status }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: "capitalize",
  backgroundColor: selected ? "#343a40" : theme.palette.background.paper,
  color: selected ? "white" : status === "uninterested" ? "gray" : "black",
  marginBottom: theme.spacing(1),
  '& span': {
    '& strong': {
      textTransform: "lowercase",
    }
  },
  '&:hover': {
    opacity: selected ? 0.9 : 1,
    color: selected ? "#343a40" : "",
    '& svg': {
      color: selected ? "#343a40" : "#343a40",
    },
  },
  '& svg': {
    color: selected ? "white" : "",
  },
}));

function LeadList({ leads, users, onDelete, onSelect, selectedLeadId }) {
  const [updatedLeads, setUpdatedLeads] = useState(leads);

  // Create a map of user IDs to usernames
  const userMap = users.reduce((map, user) => {
    map[user.id] = user.username;
    return map;
  }, {});

  // Function to check user role and filter leads
  const filterLeadsByUserRole = (leads) => {
    const userRole = localStorage.getItem("userRole");
    const userId = Number(localStorage.getItem("userId")); // Convert userId to number

    console.log("userRole:", userRole);
    console.log("userid:", userId);

    if (userRole === "SalesAgent") {
      const filteredLeads = leads.filter((lead) => {
        console.log("lead.assigned_agent_id:", lead.assigned_agent_id, "userId:", userId);
        return lead.assigned_agent_id === userId;
      });
      console.log("filteredLeads:", filteredLeads);
      return filteredLeads;
    }
    return leads;
  };

  // Sort leads by created_at property (or similar)
  const sortedLeads = [...updatedLeads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleAssignAgent = (leadId, userId) => {
    setUpdatedLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              assigned_agent_id: userId,
              lead_status: lead.lead_status === "uninterested" ? "leads" : lead.lead_status,
            }
          : lead
      )
    );
  };

  const handleUpdateStatus = (leadId, status) => {
    setUpdatedLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, lead_status: status, assigned_agent_id: null } : lead
      )
    );
  };

  useEffect(() => {
    setUpdatedLeads(leads);
  }, [leads]);

  const filteredLeads = filterLeadsByUserRole(sortedLeads);

  return (
    <>
      <div className="contentItem">
        <h2>All Leads</h2>
        {filteredLeads.length === 0 ? (
          <p className="noActiveLeads">No active leads</p>
        ) : (
          <List className="listMui">
            {Array.isArray(filteredLeads) &&
              filteredLeads.map((lead, index) => (
                <StyledListItem
                  key={index}
                  className="listItem"
                  selected={lead.id === selectedLeadId}
                  status={lead.lead_status}
                  onClick={() => onSelect(lead.id)}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight="bold" className="name agents">
                        {lead.name}
                        <Typography
                          component="span"
                          fontStyle="italic"
                        >
                          {lead.lead_status === "uninterested"
                            ? "UNINTERESTED"
                            : lead.assigned_agent_id
                            ? `@${userMap[lead.assigned_agent_id]}`
                            : ""}
                        </Typography>
                      </Typography>
                    }
                    secondary={<Typography component="span" fontStyle="">Phone: <strong>{lead.phone_number}</strong> | Email: <strong>{lead.email}</strong></Typography>}
                  />
                  <LeadOptionsMenu leadId={lead.id} onDelete={onDelete} onAssignAgent={handleAssignAgent} onUpdateStatus={handleUpdateStatus} />
                </StyledListItem>
              ))}
          </List>
        )}
      </div>
    </>
  );
}

export default LeadList;