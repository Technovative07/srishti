import Patient from "../model/patient.model.js";
import cloudinary from "../config/cloudinary.config.js";
import { extractTextFromPDF } from "../utils/pdfExtractor.js";
import fs from "fs";

export const createPatient = async (req, res) => {
  try {
    const { age, gender, bloodType, contactNo, address, allergies } = req.body;
    const userId = req.user.id;

    let profilePicUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePicUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newPatient = await Patient.create({
      userId,
      age,
      gender,
      bloodType,
      contactNo,
      address,
      allergies,
      profilePic: profilePicUrl,
    });

    res.status(201).json({
      message: "Patient created successfully",
      data: newPatient,
    });
  } catch (err) {
    console.error("Error in createPatient:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const uploadPdfReport = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const pdfText = await extractTextFromPDF(req.file.path);
    fs.unlinkSync(req.file.path); // delete uploaded file after processing

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.pdfReport = pdfText;
    await patient.save();

    res.status(200).json({ message: "PDF uploaded successfully", data: patient });
  } catch (err) {
    console.error("Error in uploadPdfReport:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id });
    res.status(200).json({
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (err) {
    console.error("Error in getAllPatients:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (err) {
    console.error("Error in getPatientById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const { age, gender, bloodType, contactNo, address, allergies } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Only upload new profile pic if a file was provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      patient.profilePic = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Update other fields
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (bloodType !== undefined) patient.bloodType = bloodType;
    if (contactNo !== undefined) patient.contactNo = contactNo;
    if (address !== undefined) patient.address = address;
    if (allergies !== undefined) patient.allergies = allergies;

    await patient.save();

    res.status(200).json({
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Error in updatePatient:", error);
    res.status(500).json({ message: "Server error" });
  }
};
