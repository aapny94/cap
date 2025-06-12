import pool from "../config/db.js";

export const getAllPaymentTerms = async () => {
  const { rows } = await pool.query("SELECT * FROM paymentterms ");
  return rows;
};

export const getPaymentTermById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM paymentterms WHERE id = $1",
    [id]
  );
  return rows[0];
};

export const createPaymentTerm = async (term) => {
  const { rows } = await pool.query(
    "INSERT INTO paymentterms (details) VALUES ($1) RETURNING *",
    [term.details]
  );
  return rows[0];
};
export const updatePaymentTerm = async (id, term) => {
  const { rows } = await pool.query(
    "UPDATE paymentterms SET details = $1 WHERE id = $2 RETURNING *",
    [term.details, id]
  );
  return rows[0];
};

export const deletePaymentTerm = async (id) => {
  if (id === 1 || id === 2) {
    throw new Error("Cannot delete this protected payment term.");
  }
  const { rows } = await pool.query(
    "DELETE FROM paymentterms WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};
