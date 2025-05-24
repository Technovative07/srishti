 import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  profilePic: {
    type: String, // Cloudinary URL of the profile picture
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  medicalHistory: [
    {
      date: { type: Date, default: Date.now },
      condition: String,
      treatment: String,
      doctorNotes: String,
    },
  ],
  currentMedicine: [
    {
      medicineName: String,
      doses: String,
      frequency: String,
    },
  ],
  allergies: String,
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  pdfReports: [
    {
      filename: String,  // original filename
      url: String,       // Cloudinary URL for the PDF file
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const patient = mongoose.model("patient", patientSchema);

export default patient;
