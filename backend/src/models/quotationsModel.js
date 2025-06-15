import pool from "../config/db.js";

export const getAllQuotations = async () => {
  const { rows } = await pool.query("SELECT * FROM quotations");
  return rows;
};
export const getQuotationById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM quotations WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

export const createQuotation = async (quotation) => {
  const { rows } = await pool.query(
    "INSERT INTO quotations (lead_id, user_id, status, total_amount) VALUES ($1, $2, $3, $4) RETURNING *",
    [
      quotation.lead_id,
      quotation.user_id,
      quotation.status,
      quotation.total_amount,
    ]
  );
  return rows[0];
};

export const updateQuotation = async (id, quotation) => {
  const { rows } = await pool.query(
    "UPDATE quotations SET lead_id = $1, user_id = $2, status = $3, total_amount = $4 WHERE id = $5 RETURNING *",
    [
      quotation.lead_id,
      quotation.user_id,
      quotation.status,
      quotation.total_amount,
      id,
    ]
  );
  return rows[0];
};
export const deleteQuotation = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM quotations WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

// quotation items

export const getAllQuotationsItemsByQuotationId = async (quotationId) => {
  const { rows } = await pool.query(
    "SELECT * FROM quotation_items WHERE quotation_id = $1",
    [quotationId]
  );
  return rows;
};

export const createQuotationItems = async (quotationId, items) => {
  const createdItems = [];

  for (const item of items) {
    const { rows } = await pool.query(
      `INSERT INTO quotation_items (quotation_id, service_id, quantity, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [quotationId, item.service_id, item.quantity, item.price]
    );
    createdItems.push(rows[0]);
  }

  return createdItems;
};

export const updateQuotationItems = async (quotationId, items) => {
  const updatedItems = [];

  for (const item of items) {
    const { rows } = await pool.query(
      `UPDATE quotation_items
       SET service_id = $2, quantity = $3, price = $4
       WHERE quotation_id = $1 AND service_id = $2
       RETURNING *`,
      [quotationId, item.service_id, item.quantity, item.price]
    );
    updatedItems.push(rows[0]);
  }

  return updatedItems;
};

export const deleteQuotationItems = async (quotationId) => {
  const { rows } = await pool.query(
    "DELETE FROM quotation_items WHERE quotation_id = $1 RETURNING *",
    [quotationId]
  );
  return rows;
};
