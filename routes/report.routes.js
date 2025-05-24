import express from "express";
import {
  createReport,
  getreports,
  getReportById,
  updateReport,
  deleteReport,
  downloadReportPDF,
} from "../controller/report.controller.js";

const router = express.Router();

// Create a new report
router.post("/", createReport);

// Get all reports
router.get("/", getreports);

// Get a single report by ID
router.get("/:id", getReportById);

// Update a report
router.put("/:id", updateReport);

// Delete a report
router.delete("/:id", deleteReport);

// 🔽 Download PDF version of the report
router.get("/:id/download", downloadReportPDF);

export default router;
