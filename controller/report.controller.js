import Report from "../model/report.model.js";
import Patient from "../model/patient.model.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import generatePDF from "../utils/pdfgenerator.js";

export const createReport = async (req, res) => {
  try {
    const {
      patientName,
      doctorName,
      title,
      description,
      keyfinds,
      reportDate,
      precription,
    } = req.body;

    let attachedFileUrl = "";
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "reports",
      });
      attachedFileUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newReport = new Report({
      patientName,
      doctorName,
      title,
      description,
      keyfinds,
      reportDate,
      precription,
      attachedFile: attachedFileUrl,
    });

    await newReport.save();

    // Push report ID to the patient's reports
    if (patientName) {
      await Patient.findByIdAndUpdate(patientName, {
        $push: { reports: newReport._id },
      });
    }

    res.status(201).json({ message: "Report created successfully", newReport });
  } catch (error) {
    console.error("CREATE REPORT ERROR:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getreports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patientName", "name")
      .populate("doctorName", "name specialization");

    res.status(200).json({ reports });
  } catch (error) {
    console.error("GET REPORTS ERROR:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("patientName", "name")
      .populate("doctorName", "name specialization");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ report });
  } catch (error) {
    console.error("GET REPORT BY ID ERROR:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patientName,
      doctorName,
      title,
      description,
      keyfinds,
      reportDate,
      precription,
    } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "reports",
      });
      report.attachedFile = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    report.patientName = patientName || report.patientName;
    report.doctorName = doctorName || report.doctorName;
    report.title = title || report.title;
    report.description = description || report.description;
    report.keyfinds = keyfinds || report.keyfinds;
    report.reportDate = reportDate || report.reportDate;
    report.precription = precription || report.precription;

    await report.save();

    res.status(200).json({ message: "Report updated", report });
  } catch (error) {
    console.error("UPDATE REPORT ERROR:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.patientName) {
      await Patient.findByIdAndUpdate(report.patientName, {
        $pull: { reports: id },
      });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const downloadReportPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("patientName", "name")
      .populate("doctorName", "name specialization");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const pdfBuffer = await generatePDF(report);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${report._id}.pdf`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("DOWNLOAD PDF ERROR:", error);
    res.status(500).json({ error: error.message || "Server error generating PDF" });
  }
};
