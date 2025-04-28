

const BASE_URL =  "http://localhost:3001/api";

export const API_POST_LOGIN = `${BASE_URL}/login`; // api to login user //
export const API_POST_REGISTER = `${BASE_URL}/register`; // Add the endpoint for registering a new user
export const API_POST_LEAD = `${BASE_URL}/lead`; // Add the endpoint for creating a new lead
export const API_POST_CONTRACT_TYPE = `${BASE_URL}/contracttype`; // Add the endpoint for creating a new contract
export const API_POST_CONTRACT_ITEM = `${BASE_URL}/contractitem`; // Add the endpoint for creating a new contract item

export const API_GET_USERS = `${BASE_URL}/users`; // Add the endpoint for fetching the list of all users
export const API_GET_USER = `${BASE_URL}/user`; // Add the endpoint for getting user data //
export const API_GET_LEADS = `${BASE_URL}/leads`; // Add the endpoint for fetching the list of all leads
export const API_GET_LEAD = `${BASE_URL}/lead`; // Add the endpoint for getting lead data
export const API_GET_CONTRACT_TYPE = `${BASE_URL}/contracttype`; // Add the endpoint for fetching the list of all contract types
export const API_GET_CONTRACT_ITEM = `${BASE_URL}/contractitem`; // Add the endpoint for fetching the list of all contract items

export const API_CHANGE_USER_STATUS = `${BASE_URL}/user/status`; // Add the endpoint for changing user status
export const API_RESET_PASSWORD = `${BASE_URL}/user/reset-password`; // Add the endpoint for resetting password
export const API_UPDATE_PASSWORD = `${BASE_URL}/user/update-password`; // Add the endpoint for updating password with token
export const API_UPDATE_USER = `${BASE_URL}/user`; // Add the endpoint for updating user details
export const API_ASSIGN_AGENT = `${BASE_URL}/assign-agent`; // Add the endpoint for assigning an agent to a lead
export const API_UPDATE_LEAD_UNINTERESTED = `${BASE_URL}/update-lead-status-uninterested`; // Add the endpoint for updating lead status
export const API_UPDATE_CONTRACT_TYPE = `${BASE_URL}/contracttype`; // Add the endpoint for updating contract type
export const API_UPDATE_CONTRACT_TYPE_POSITIONS = `${BASE_URL}/contract-types/position`; // Add the endpoint for updating contract type position
export const API_UPDATE_CONTRACT_ITEM = `${BASE_URL}/contractitem`; // Add the endpoint for updating contract item
export const API_UPDATE_CONTRACT_ITEM_POSITIONS = `${BASE_URL}/contractitem/position_item`; // Add the endpoint for updating contract item positions

export const API_DELETE_USER = `${BASE_URL}/user`; // Add the endpoint for deleting a user
export const API_DELETE_LEAD = `${BASE_URL}/lead`; // Add the endpoint for deleting a lead
export const API_DELETE_CONTRACT_TYPE = `${BASE_URL}/contract-types`; // Add the endpoint for deleting a contract type