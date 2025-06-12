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
  deleteContractItemController,
  updateContractItemPositionController,
} from "../controllers/contractController.js";

import {
  createPaymentTermController,
  deletePaymentTermController,
  getAllPaymentTermsByIdComtroller,
  getAllPaymentTermsController,
  updatePaymentTermController,
} from "../controllers/paymentTermsController.js";
import {
  createServiceController,
  createServiceItemController,
  deleteServiceController,
  deleteServiceItemController,
  getAllServicesController,
  getServiceByIdController,
  getServiceItemsByServiceIdController,
  updateServiceController,
  updateServiceItemController,
} from "../controllers/serviceController.js";

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
router.put("/contractitem/position-item", updateContractItemPositionController);
router.put("/contractitem/:id", updateContractItemController);
router.delete("/contractitem/:id", deleteContractItemController);
router.get("/paymentterms", getAllPaymentTermsController);
router.get("/paymentterms/:id", getAllPaymentTermsByIdComtroller);
router.put("/paymentterms/:id", updatePaymentTermController);
router.post("/paymentterms", createPaymentTermController);
router.delete("/paymentterms/:id", deletePaymentTermController);

router.get("/services", getAllServicesController);
router.get("/services/:id", getServiceByIdController);
router.post("/services", createServiceController);
router.put("/services/:id", updateServiceController);
router.delete("/services/:id", deleteServiceController); // Assuming you want to fetch a service by ID as well
router.get("/services-items/:serviceId", getServiceItemsByServiceIdController);
router.post("/services-items", createServiceItemController);
router.put("/services-items/:id", updateServiceItemController); // Assuming you want to update a service item by ID
router.delete("/services-items/:id", deleteServiceItemController); // Assuming you want to delete a service item by ID

export default router;

// here will contains all the API routes of the application //
// http://{backend-url}/user/{id} => GET => getUser //
