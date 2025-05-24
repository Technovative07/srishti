import express from "express";
import {
  createAuditLog,
  getAuditLogById,
  getAllAuditLogs,
} from "../controller/Auditlog.controller.js";

const router = express.Router();

// @route   POST /api/v1/audit
// @desc    Create a new audit log
router.post("/", createAuditLog);

// @route   GET /api/v1/audit/:id
// @desc    Get a single audit log by ID
router.get("/:id", getAuditLogById);

// @route   GET /api/v1/audit
// @desc    Get all audit logs
router.get("/", getAllAuditLogs);

export default router;
