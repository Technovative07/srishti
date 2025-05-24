import express from "express";
import multer from "multer";
import {
  createPatient,
  uploadPdfReport,
  getAllPatients,
  getPatientById,
  updatePatient,
} from "../controller/patient.controller.js";
import { verifyToken } from "../config/auth.config.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", verifyToken, upload.single("profilePic"), createPatient);
router.post("/upload-pdf/:id", verifyToken, upload.single("pdf"), uploadPdfReport);
router.get("/", verifyToken, getAllPatients);
router.get("/:id", verifyToken, getPatientById);
router.put("/:id", verifyToken, upload.single("profilePic"), updatePatient);

export default router;
