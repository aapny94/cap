import pool from '../config/db.js';


// API to get lead by id
export const getLeadById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
  return rows[0];
};

// API to get leads by agent id
export const getLeadsByAgentId = async (agentId) => {
  const { rows } = await pool.query('SELECT * FROM leads WHERE assigned_agent_id = $1', [agentId]);
  return rows;
};

// API to get lead by email
export const getLeadByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM leads WHERE email = $1', [email]);
  return rows[0];
};

// API to get lead by phone number
export const getLeadByPhoneNumber = async (phone_number) => {
  const { rows } = await pool.query('SELECT * FROM leads WHERE phone_number = $1', [phone_number]);
  return rows[0];
};


// API to get all leads
export const getAllLeads = async () => {
  const { rows } = await pool.query('SELECT * FROM leads');
  return rows;
};

// API to create new lead
export const createLead = async (name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id	) => {
    const { rows } = await pool.query(
        'INSERT INTO leads (name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id	]
    );
    return rows[0];
};

// API to update lead
export const updateLead = async (id, name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id, lead_status	 ) => {
    const { rows } = await pool.query(
        'UPDATE leads SET name = $1, phone_number = $2, email = $3, budget = $4, size = $5, house_type = $6, house_status = $7, key_status = $8, remark = $9, assigned_agent_id = $10, lead_status = $11 WHERE id = $12 RETURNING *',
        [name, phone_number, email, budget, size, house_type, house_status, key_status, remark, assigned_agent_id, lead_status, id]
    );
    return rows[0];
};

// API to delete lead
export const deleteLead = async (id) => {
  const { rows } = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
  return rows[0];
};

// API to update lead status
export const updateLeadStatus = async (id, status) => {
    const { rows } = await pool.query(
        'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return rows[0];
};

// API to update assigned agent for a lead
export const updateAssignedAgent = async (leadId, agentId) => {
  const { rows } = await pool.query(
    'UPDATE leads SET assigned_agent_id = $1 WHERE id = $2 RETURNING *',
    [agentId, leadId]
  );
  return rows[0];
};

// API to update lead status to "uninterested" and remove assigned agent if not null
export const updateLeadStatusToUninterestedAndRemoveAgent = async (leadId) => {
  const { rows } = await pool.query(
    `UPDATE leads 
     SET lead_status = 'uninterested', 
         assigned_agent_id = CASE 
                             WHEN assigned_agent_id IS NOT NULL THEN NULL 
                             ELSE assigned_agent_id 
                             END 
     WHERE id = $1 
     RETURNING *`,
    [leadId]
  );
  return rows[0];
};


// API to update lead status to "leads"
export const updateLeadStatusToLeads = async (leadId) => {
  const { rows } = await pool.query(
    `UPDATE leads 
     SET lead_status = 'leads'
     WHERE id = $1 
     RETURNING *`,
    [leadId]
  );
  return rows[0];
};
