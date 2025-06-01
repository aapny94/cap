import { deleteLead, createLead, getLeadById, getLeadsByAgentId, getLeadByEmail, updateLeadStatusToLeads, getLeadByPhoneNumber, getAllLeads, updateAssignedAgent, updateLeadStatusToUninterestedAndRemoveAgent } from "../models/leadModel.js";

// API to get leads by ID
export const listAllLeadsById = async (req, res) => {

    try {
        const leadId = req.params.id;
        const lead = await getLeadById(leadId);

        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        res.json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message }); 

    }
};


// API to get leads by agent ID
export const listLeadsByAgentId = async (req, res) => {
    try {
        const agentId = req.params.id;
        const leads = await getLeadsByAgentId(agentId);
        res.json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// API to create new lead
export const createNewLead = async (req, res) => {
    try {
        const { name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id	 } = req.body;
   

        const newLead = await createLead(name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id	);
        res.status(201).json(newLead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// API to get all leads
export const listAllLeads = async (req, res) => {
    try {
        const leads = await getAllLeads();
        res.json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// API to Delete Lead 
export const removeLead = async (req, res) => {
    try {
      const leadId = parseInt(req.params.id, 10); // Ensure leadId is an integer
      if (isNaN(leadId)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
  
      const deletedLead = await deleteLead(leadId);
      if (!deletedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
  
      res.status(200).json({ message: "Lead deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

// Controller to update assigned agent for a lead
export const assignAgentToLead = async (req, res) => {
    const { leadId, agentId } = req.body;
  
    try {
      // Fetch the current lead details
      const lead = await getLeadById(leadId);
  
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
  
      // Check the current lead status and update it to "leads" if necessary
      if (lead.lead_status !== "leads") {
        await updateLeadStatusToLeads(leadId);
      }
  
      // Update the assigned agent
      const updatedLead = await updateAssignedAgent(leadId, agentId);
      res.status(200).json(updatedLead);
    } catch (error) {
      console.error("There was an error assigning the agent!", error);
      res.status(500).json({ error: "Failed to assign agent. Please try again." });
    }
  };
  


// Controller to update lead status to "uninterested" and remove assigned agent if not null
export const setLeadUninterested = async (req, res) => {
    const { leadId } = req.body;
  
    try {
      const updatedLead = await updateLeadStatusToUninterestedAndRemoveAgent(leadId);
      res.status(200).json(updatedLead);
    } catch (error) {
      console.error("There was an error updating the lead status and removing the agent!", error);
      res.status(500).json({ error: "Failed to update lead status and remove agent. Please try again." });
    }
  };