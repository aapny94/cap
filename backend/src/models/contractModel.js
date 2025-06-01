import pool from "../config/db.js";

export const getAllContractsType = async () => {
  const { rows } = await pool.query("SELECT * FROM contracttype ORDER BY position ASC");
  return rows;
};

// Function to create a new contract type with the next calculated position
export const createNewContractType = async (name, notes) => {
  const { rows: positionRows } = await pool.query(
    "SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM contracttype"
  );
  const position = positionRows[0].next_position;

  const { rows } = await pool.query(
    "INSERT INTO contracttype (name, notes, position) VALUES ($1, $2, $3) RETURNING *",
    [name, notes, position]
  );

  return rows[0];
};



// Function to update only the name and notes of an existing contract type
export const updateContractType = async (id, name, notes) => {
  const { rows } = await pool.query(
    "UPDATE contracttype SET name = $1, notes = $2 WHERE id = $3 RETURNING *",
    [name, notes, id]
  );
  return rows[0];
};

// Function to delete a contract type and its associated items
export const deleteContractType = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Delete related items first
    await client.query("DELETE FROM contractitem WHERE contract_type_id = $1", [id]);

    // Delete the contract type and get the deleted row
    const { rows: deletedRows } = await client.query(
      "DELETE FROM contracttype WHERE id = $1 RETURNING *",
      [id]
    );
    const deletedContractType = deletedRows[0];

    if (!deletedContractType) {
      throw new Error("Contract type not found");
    }

    // Get all remaining contract types ordered by position
    const { rows: remainingRows } = await client.query(
      "SELECT id FROM contracttype ORDER BY position ASC"
    );

    // Reassign positions sequentially
    for (let index = 0; index < remainingRows.length; index++) {
      const newPosition = index + 1;
      const currentId = remainingRows[index].id;
      await client.query(
        "UPDATE contracttype SET position = $1 WHERE id = $2",
        [newPosition, currentId]
      );
    }

    await client.query("COMMIT");
    return deletedContractType;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting contract type:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to update the positions of contract types in a single transaction
export const updateContractTypePositions = async (updates) => {
  const updateQueries = updates.map((update) =>
    pool.query(
      "UPDATE contracttype SET position = $1 WHERE id = $2",
      [update.newPosition, update.id]
    )
  );
  await Promise.all(updateQueries);
};



// Function to get a contract type by ID
export const getContractTypeById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM contracttype WHERE id = $1",
    [id]
  );
  return rows[0];
};





// Function to create a new contract item
export const createNewContractItem = async (content, contract_type_id, notes) => {
  const { rows: positionRows } = await pool.query(
    "SELECT COALESCE(MAX(position_item), 0) + 1 AS next_position FROM contractitem WHERE contract_type_id = $1",
    [contract_type_id]
  );

  const position_item = positionRows[0].next_position;

  const { rows } = await pool.query(
    "INSERT INTO contractitem (content, contract_type_id, notes, position_item) VALUES ($1, $2, $3, $4) RETURNING *",
    [content, contract_type_id, notes, position_item]
  );
  return rows[0];
};


export const getContractsItemByType = async (contract_type_id) => {
  const { rows } = await pool.query(
    "SELECT * FROM contractitem WHERE contract_type_id = $1 ORDER BY position_item::INTEGER",
    [contract_type_id]
  );
  return rows;
};

// Function to update a contract item
export const updateContractItem = async (id, content, notes) => {
  const { rows } = await pool.query(
    "UPDATE contractitem SET content = $1, notes = $2 WHERE id = $3 RETURNING *",
    [content, notes, id]
  );
  return rows[0];
};

