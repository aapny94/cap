import {
  createPaymentTerm,
  deletePaymentTerm,
  getAllPaymentTerms,
  getPaymentTermById,
  updatePaymentTerm,
} from "../models/paymentTermsModel.js";

export const getAllPaymentTermsController = async (req, res) => {
  try {
    const paymentTerms = await getAllPaymentTerms();
    res.status(200).json(paymentTerms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllPaymentTermsByIdComtroller = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentTerm = await getPaymentTermById(id);
    if (!paymentTerm) {
      return res.status(404).json({ error: "Payment term not found" });
    }
    res.status(200).json(paymentTerm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createPaymentTermController = async (req, res) => {
  const { details } = req.body;
  try {
    if (!details) {
      return res.status(400).json({ error: "Details are required" });
    }
    const newPaymentTerm = await createPaymentTerm({ details });
    res.status(201).json(newPaymentTerm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePaymentTermController = async (req, res) => {
  const { id } = req.params;
  const { details } = req.body;
  try {
    if (!details) {
      return res.status(400).json({ error: "Details are required" });
    }
    const updatedPaymentTerm = await updatePaymentTerm(id, { details });
    if (!updatedPaymentTerm) {
      return res.status(404).json({ error: "Payment term not found" });
    }
    res.status(200).json(updatedPaymentTerm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePaymentTermController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPaymentTerm = await deletePaymentTerm(id);
    if (!deletedPaymentTerm) {
      return res.status(404).json({ error: "Payment term not found" });
    }
    res.status(200).json(deletedPaymentTerm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

//
