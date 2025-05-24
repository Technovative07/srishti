import Doctor from "../model/doctor.model.js";
import User from "../model/user.model.js";
import cloudinary from "../config/cloudinary.config.js";

// Register Doctor
export const registerDoctor = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      qualification,
      experience,
      contactNo,
      clinicAddress,
      availability,
    } = req.body;

    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const doctor = new Doctor({
      userId,
      specialization,
      qualification,
      experience,
      contactNo,
      clinicAddress,
      availability,
    });

    await doctor.save();

    return res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error("Error in registerDoctor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Doctor by userId
export const getDoctorbyid = async (req, res) => {
  try {
    const { userId } = req.params;
    const doctor = await Doctor.findOne({ userId }).populate("userId", "name email");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Error in getDoctorbyid:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update Doctor
export const updateDoctor = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      specialization,
      qualification,
      experience,
      contactNo,
      clinicAddress,
      availability,
    } = req.body;

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Update fields if provided
    if (specialization !== undefined) doctor.specialization = specialization;
    if (qualification !== undefined) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (contactNo !== undefined) doctor.contactNo = contactNo;
    if (clinicAddress !== undefined) doctor.clinicAddress = clinicAddress;
    if (availability !== undefined) doctor.availability = availability;

    await doctor.save();

    return res.json({ message: "Doctor profile updated.", doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { userId } = req.params;
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.deleteOne();

    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Upload Doctor Avatar (profile image)
export const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params; // doctor _id
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctor_avatars",
    });

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    doctor.avatar = result.secure_url;
    await doctor.save();

    res.json({ message: "Avatar updated successfully.", avatarUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get all Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error." });
  }
};
