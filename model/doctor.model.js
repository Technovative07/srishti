import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  clinicAddress: {
    type: String,
  },
  availability: [
    {
      day: { type: String },       // e.g. Monday
      startTime: { type: String }, // e.g. 09:00
      endTime: { type: String },   // e.g. 17:00
    }
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    }
  ],
  avatar: {
    type: String, // Cloudinary URL for profile image
    default: "",  // Optional default image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
