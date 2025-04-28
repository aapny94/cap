import express from "express";
import {
  getUser,
  registerUser,
  loginUser,
  listUsers,
  changeUserStatus,
  deleteUser,
  resetPassword,
  updatePasswordWithToken,
  updateUser,
} from "../controllers/userController.js";

import {
  listAllLeads,
  listAllLeadsById,
  listLeadsByAgentId,
  createNewLead,
  removeLead,
  assignAgentToLead,
  setLeadUninterested,
} from "../controllers/leadController.js";

import {
  listAllContractsType,
  listAllContractsItemByType,
  createNewContractTypeController,
  updateContractTypeController,
  deleteContractTypeController,
  updateContractTypePositionController,
  getContractTypeByIdController,
  createNewContractItemController,
  updateContractItemController,
} from "../controllers/contractController.js";

const router = express.Router();

router.get("/user/:id", getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", listUsers); // New route to list all users
router.post("/user/status", changeUserStatus); // New route to update user status
router.delete("/user/:id", deleteUser); // Route to delete a user
router.post("/user/reset-password", resetPassword); // Route to generate reset password link
router.post("/user/update-password", updatePasswordWithToken); // Route to update password with token
router.put("/user/:id", updateUser); // Route to update user details
router.get("/lead/:id", listAllLeadsById); // New route to get leads by ID
router.get("/lead/agent/:id", listLeadsByAgentId); // New route to get leads by agent ID
router.post("/lead", createNewLead); // New route to create a new lead
router.get("/leads", listAllLeads); // New route to get all leads
router.delete("/lead/:id", removeLead); // New route to delete a lead
router.post("/assign-agent", assignAgentToLead);
router.post("/update-lead-status-uninterested", setLeadUninterested);
router.get("/contracttype", listAllContractsType); // New route to list all contract type
router.get("/contractitem/:contract_type_id", listAllContractsItemByType); // New route to list all contract item by contract type
router.put("/contracttype/:id", updateContractTypeController);
router.post("/contracttype", createNewContractTypeController);
router.delete("/contract-types/:id", deleteContractTypeController);
router.put("/contract-types/position", updateContractTypePositionController);
router.get("/contracttype/:id", getContractTypeByIdController); // Define the new route
router.post("/contractitem", createNewContractItemController);
router.put("/contractitem/:id", updateContractItemController);


export default router;

// here will contains all the API routes of the application //
// http://{backend-url}/user/{id} => GET => getUser //
