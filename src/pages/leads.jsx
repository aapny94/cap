import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_GET_LEADS, API_GET_USERS } from "../apiConfig";
import { Button } from "@mui/material";
import LeadList from "../components/leadList";
import CreateLead from "../components/createLead";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LeadDetails from "../components/leadDetails";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showCreateLead, setShowCreateLead] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(API_GET_LEADS);
        setLeads(response.data);
      } catch (err) {
        setError("Failed to fetch leads");
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

    fetchLeads();
    fetchUsers();
  }, []);

  const handleLeadCreated = (newLead) => {
    setLeads((prevLeads) => [...prevLeads, newLead]);
    setShowCreateLead(false);
  };

  const handleLeadDeleted = (leadId) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
    if (selectedLeadId === leadId) {
      setSelectedLeadId(null);
    }
  };

  const handleLeadSelected = (leadId) => {
    setSelectedLeadId(leadId);
    setShowCreateLead(false);
  };

  const handleAddNewLead = () => {
    setSelectedLeadId(null);
    setShowCreateLead(true);
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="contentFlex">
        <LeadList
          leads={leads}
          users={users}
          onDelete={handleLeadDeleted}
          onSelect={handleLeadSelected}
          selectedLeadId={selectedLeadId}
        />
        <div className="leadsRightSection">
          <div className="childItem1">
            <Button
              type="button"
              startIcon={<PersonAddAltIcon />}
              variant="contained"
              className="userBtn"
              fullWidth
              sx={{ backgroundColor: "black", color: "white", marginTop: 2 }}
              onClick={handleAddNewLead}
            >
              Add New Lead
            </Button>
          </div>

          {showCreateLead ? (
            <CreateLead onLeadCreated={handleLeadCreated} />
          ) : (
            selectedLeadId && <LeadDetails leadId={selectedLeadId} />
          )}
        </div>
      </div>
    </>
  );
}

export default Leads;