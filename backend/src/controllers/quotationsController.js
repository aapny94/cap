import {
  getAllQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  getAllQuotationsItemsByQuotationId,
  createQuotationItems,
  updateQuotationItems,
  deleteQuotationItems,
} from "../models/quotationsModel.js";
import { getQuotationsByUsername } from "../models/quotationsModel.js";


export const fetchQuotationsByUsername = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: "Username query is required" });
    }

    const data = await getQuotationsByUsername(username);
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch quotations:", error);
    res.status(500).json({ message: "Failed to filter quotations", error });
  }
};



// === Quotations ===
export const fetchAllQuotations = async (req, res) => {
  try {
    const quotations = await getAllQuotations();
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quotations", error });
  }
};

export const fetchQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await getQuotationById(id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quotation", error });
  }
};

export const addQuotation = async (req, res) => {
  try {
    const newQuotation = await createQuotation(req.body);
    res.status(201).json(newQuotation);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quotation", error });
  }
};

export const modifyQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuotation = await updateQuotation(id, req.body);
    res.status(200).json(updatedQuotation);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quotation", error });
  }
};

export const removeQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteQuotation(id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete quotation", error });
  }
};

// === Quotation Items ===
export const fetchQuotationItems = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const items = await getAllQuotationsItemsByQuotationId(quotationId);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quotation items", error });
  }
};

export const addQuotationItems = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const created = await createQuotationItems(quotationId, req.body.items);
    res.status(201).json(created);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create quotation items", error });
  }
};

export const modifyQuotationItems = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const updated = await updateQuotationItems(quotationId, req.body.items);
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update quotation items", error });
  }
};

export const removeQuotationItems = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const deleted = await deleteQuotationItems(quotationId);
    res.status(200).json(deleted);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete quotation items", error });
  }
};
