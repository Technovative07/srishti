import Audit from "../model/AuditLog.model.js"; // Make sure path is correct

// Create an audit log
export const createAuditLog = async (req, res) => {
  try {
    const {
      action,
      performedby,
      targetModel,
      targetId,
      description,
      ipAddress,
      changes,
    } = req.body;

    const audit = new Audit({
      action,
      performedby,
      targetModel,
      targetId,
      description,
      ipAddress,
      changes,
    });

    const savedAudit = await audit.save();
    res.status(201).json({ message: "Audit log created", audit: savedAudit });
  } catch (err) {
    console.error("Error creating audit log:", err);
    res.status(500).json({ message: "Failed to create audit log" });
  }
};

// Get a single audit log by ID
export const getAuditLogById = async (req, res) => {
  try {
    const log = await Audit.findById(req.params.id).populate(
      "performedby",
      "name email"
    );

    if (!log) {
      return res.status(404).json({ message: "Audit log not found" });
    }

    res.status(200).json(log);
  } catch (err) {
    console.error("Error fetching audit log:", err);
    res.status(500).json({ message: "Failed to retrieve audit log" });
  }
};

// Get all audit logs
export const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await Audit.find()
      .populate("performedby", "name email")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error("Error retrieving audit logs:", err);
    res.status(500).json({ message: "Failed to retrieve audit logs" });
  }
};
