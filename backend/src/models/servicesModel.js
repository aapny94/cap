import pool from "../config/db.js";

export const getAllServices = async () => {
  const { rows } = await pool.query("SELECT * FROM services");
  return rows;
}

export const getServiceById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM services WHERE id = $1",
    [id]
  );
  return rows[0];
};

export const createService = async (service) => {
  const { rows } = await pool.query(
    "INSERT INTO services (name, notes) VALUES ($1, $2) RETURNING *",
    [service.name, service.notes]
  );
  return rows[0];
};

export const updateService = async (id, service) => {
  const { rows } = await pool.query(
    "UPDATE services SET name = $1, notes = $2 WHERE id = $3 RETURNING *",
    [service.name, service.notes, id]
  );
  return rows[0];
};

export const deleteService = async (id) => {
  // No need to manually delete serviceitems
  // Because `ON DELETE CASCADE` will automatically delete them
  const { rows } = await pool.query(
    "DELETE FROM services WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

export const getServiceItemsByServiceId = async (serviceId) => {
  const { rows } = await pool.query(
    "SELECT * FROM serviceitems WHERE services_id = $1",
    [serviceId]
  );
  return rows;
}

export const createServiceItem = async (serviceItem) => {
  const { rows } = await pool.query(
    "INSERT INTO serviceitems (item, type, unit_price, services_id, note) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [serviceItem.item, serviceItem.type, serviceItem.unit_price, serviceItem.services_id, serviceItem.note]
  );
  return rows[0];
};

export const updateServiceItem = async (id, serviceItem) => {
  const { rows } = await pool.query(
    "UPDATE serviceitems SET item = $1, type = $2, unit_price = $3, note = $4 WHERE id = $5 RETURNING *",
    [serviceItem.item, serviceItem.type, serviceItem.unit_price, serviceItem.note, id]
  );
  return rows[0];
};

export const deleteServiceItem = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM serviceitems WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};
