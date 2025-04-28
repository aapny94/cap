import pool from '../config/db.js';

export const getUserById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

export const getUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

export const getUserByUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0];
};

export const createUser = async (first_name, last_name, username,  hashedPassword, email, user_role ) => {
  const { rows } = await pool.query(
    'INSERT INTO users (first_name, last_name, username, password, email, user_role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [ first_name, last_name, username,  hashedPassword, email, user_role ]
  );
  return rows[0];
};

export const getAllUser = async () => {
  const { rows } = await pool.query('SELECT id, first_name, last_name, email, username, user_role, status FROM users');
  return rows;
};


// New function to update user status
export const updateUserStatus = async (id, status) => {
  const { rows } = await pool.query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0];
};

// New function to remove a user
export const removeUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};


// New function to update password
export const updatePassword = async (id, hashedPassword) => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
};



// New function to find user by reset token
export const getUserByToken = async (token) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE reset_token = $1', [token]);
  return rows[0];
};


// New function to store reset token
export const storeResetToken = async (id, resetToken) => {
  await pool.query('UPDATE users SET reset_token = $1 WHERE id = $2', [resetToken, id]);
};

// New function to update user details
export const updateUserDetails = async (id, first_name, last_name, username, email, user_role) => {
  const { rows } = await pool.query(
    'UPDATE users SET first_name = $1, last_name = $2, username = $3, email = $4, user_role = $5 WHERE id = $6 RETURNING *',
    [first_name, last_name, username, email, user_role, id]
  );
  return rows[0];
};
// Sample of API Calling //