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

import {
  fetchAllQuotations,
  fetchQuotationById,
  addQuotation,
  modifyQuotation,
  removeQuotation,
  fetchQuotationItems,
  addQuotationItems,
  modifyQuotationItems,
  removeQuotationItems,
  fetchQuotationsByUsername, // new role-based quotation filtering
} from "../controllers/quotationsController.js";

import { decodeUserFromToken } from "../middleware/auth.js"; // make sure this exists

const router = express.Router();

// User Routes
router.get("/user/:id", getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", listUsers);
router.post("/user/status", changeUserStatus);
router.delete("/user/:id", deleteUser);
router.post("/user/reset-password", resetPassword);
router.post("/user/update-password", updatePasswordWithToken);
router.put("/user/:id", updateUser);

// Lead Routes
router.get("/lead/:id", listAllLeadsById);
router.get("/lead/agent/:id", listLeadsByAgentId);
router.post("/lead", createNewLead);
router.get("/leads", listAllLeads);
router.delete("/lead/:id", removeLead);
router.post("/assign-agent", assignAgentToLead);
router.post("/update-lead-status-uninterested", setLeadUninterested);

// Contract Routes
router.get("/contracttype", listAllContractsType);
router.get("/contractitem/:contract_type_id", listAllContractsItemByType);
router.post("/contracttype", createNewContractTypeController);
router.put("/contracttype/:id", updateContractTypeController);
router.delete("/contract-types/:id", deleteContractTypeController);
router.put("/contract-types/position", updateContractTypePositionController);
router.get("/contracttype/:id", getContractTypeByIdController);
router.post("/contractitem", createNewContractItemController);
router.put("/contractitem/:id", updateContractItemController);
router.put("/contractitem/position-item", updateContractItemPositionController);
router.delete("/contractitem/:id", deleteContractItemController);

// Payment Term Routes
router.get("/paymentterms", getAllPaymentTermsController);
router.get("/paymentterms/:id", getAllPaymentTermsByIdComtroller);
router.put("/paymentterms/:id", updatePaymentTermController);
router.post("/paymentterms", createPaymentTermController);
router.delete("/paymentterms/:id", deletePaymentTermController);

// Service Routes
router.get("/services", getAllServicesController);
router.get("/services/:id", getServiceByIdController);
router.post("/services", createServiceController);
router.put("/services/:id", updateServiceController);
router.delete("/services/:id", deleteServiceController);
router.get("/services-items/:serviceId", getServiceItemsByServiceIdController);
router.post("/services-items", createServiceItemController);
router.put("/services-items/:id", updateServiceItemController);
router.delete("/services-items/:id", deleteServiceItemController);

// === Quotations Routes ===
router.get("/quotations", fetchAllQuotations);
router.get("/quotations/:id", fetchQuotationById);
router.post("/quotations", addQuotation);
router.put("/quotations/:id", modifyQuotation);
router.delete("/quotations/:id", removeQuotation);

// Role-filtered quotations (protected)
router.get("/quotations-filtered", fetchQuotationsByUsername);

// === Quotation Items Routes ===
router.get("/quotations/:quotationId/items", fetchQuotationItems);
router.post("/quotations/:quotationId/items", addQuotationItems);
router.put("/quotations/:quotationId/items", modifyQuotationItems);
router.delete("/quotations/:quotationId/items", removeQuotationItems);

export default router;
