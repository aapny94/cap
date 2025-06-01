import { getUserById } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Use the correct import statement

import {
  getUserByEmail,
  createUser,
  getUserByUsername,
  getAllUser,
  updateUserStatus,
  removeUser,
  getUserByToken, updatePassword, storeResetToken, updateUserDetails,
} from "../models/userModel.js";

// this condition to get user by id //
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// this condition to create user //
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, password, email, user_role } =
      req.body;

    // Check if user already exists
    const existingUserByEmail = await getUserByEmail(email);
    const existingUserByUsername = await getUserByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser(
      first_name,
      last_name,
      username,
      hashedPassword,
      email,
      user_role
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// this condition to login user //
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if user exists by username or email
    const user =
      (await getUserByUsername(identifier)) ||
      (await getUserByEmail(identifier));
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // Check if user is banned
    if (!user.status) {
      return res.status(403).json({ error: "User is banned" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({ token, user_role: user.user_role, user_id: user.id }); // Include user_id in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUser();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// New function to update user status
export const changeUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const updatedUser = await updateUserStatus(id, status);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// New function to delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await removeUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// New function to reset password
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the reset token in the database
    await storeResetToken(id, resetToken);

    // Generate a reset link
    const resetLink = `http://localhost:3030/reset-password/${resetToken}`;

    res.json({ resetLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// New function to handle password update with token
export const updatePasswordWithToken = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find the user by the reset token
    const user = await getUserByToken(token);

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await updatePassword(user.id, hashedPassword);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// New function to handle user details update
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, username, email, user_role } = req.body;

    const updatedUser = await updateUserDetails(id, first_name, last_name, username, email, user_role);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Sample of API Condition //
