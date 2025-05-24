import express from "express";
import {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
   
} from "../controller/appointment.controller.js";
import { verifyToken } from "../config/auth.config.js";

const router = express.Router();

// Add a new appointment
router.post("/", verifyToken, addAppointment);

// Get all appointments
router.get("/", verifyToken, getAllAppointments);

// Get appointment by ID
router.get("/:id", verifyToken, getAppointmentById);

// Update appointment by ID
router.put("/:id", verifyToken, updateAppointment);

// Delete appointment by ID
 

export default router;
