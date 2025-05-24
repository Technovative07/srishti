import Appointment from "../model/appointment.model.js";
import Patient from "../model/patient.model.js";
import Doctor from "../model/doctor.model.js";

// Create Appointment
export const addAppointment = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      appointmentType,
      reason,
    } = req.body;

    const newAppointment = new Appointment({
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      appointmentType,
      reason,
    });

    await newAppointment.save();

    await Patient.findByIdAndUpdate(patient, {
      $push: { appointments: newAppointment._id },
    });

    await Doctor.findByIdAndUpdate(doctor, {
      $push: { appointments: newAppointment._id },
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Get All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "userId age gender")
      .populate("doctor", "userId specialization");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get Appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate("patient", "userId age gender")
      .populate("doctor", "userId specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Patient.findByIdAndUpdate(appointment.patient, {
      $pull: { appointments: appointment._id },
    });

    await Doctor.findByIdAndUpdate(appointment.doctor, {
      $pull: { appointments: appointment._id },
    });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
