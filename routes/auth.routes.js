import express from "express";
import {
  register,
  login,
  getUsers,
  updateUser,
  logout,
  updatePassword,
} from "../controller/auth.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
 

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get all users (protected, ideally only admin)
router.get("/users", authenticateJWT, getUsers);

// Update a user profile by ID (protected)
router.put("/users/:id", authenticateJWT, updateUser);

// Update logged-in user's password (protected)
router.put("/users/password", authenticateJWT, updatePassword);

// Logout (optional)
router.post("/logout", authenticateJWT, logout);

export default router;
