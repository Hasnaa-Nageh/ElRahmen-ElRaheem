const Appointment = require("./../models/appointment.model");
const Patient = require("./../models/patient.model");
const Doctor = require("./../models/doctor.model");
const User = require("./../models/user.model");

const mongoose = require("mongoose");

const addAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(patient)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctor)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Check patient in Patient or User
    let patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      patientDoc = await User.findOne({ _id: patient, role: "patient" });
    }
    if (!patientDoc) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check doctor
    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Build datetime object
    const appointmentDate = new Date(`${date}T${time}:00.000Z`);

    // Check patient conflict
    const patientConflict = await Appointment.findOne({
      patient,
      appointmentDate,
    });
    if (patientConflict) {
      return res.status(400).json({
        message: "This patient already has an appointment at this time",
      });
    }

    // Check doctor conflict
    const doctorConflict = await Appointment.findOne({
      doctor,
      appointmentDate,
    });

    if (doctorConflict) {
      return res.status(400).json({
        message: "This doctor already has an appointment at this time",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
    });

    res.status(201).json({
      success: true,
      message: "Appointment added successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.find();
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, message: "No Appointment Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "All Appointments", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
const getPatientAppointments = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Appointment Deleted Successfully",
      appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, req.body);
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Appointment Found", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    // const appointments = await Appointment.find({ doctor: doctorId })
    //   .populate("patient" ,"fullname phone")
    //   .sort({ date: 1 });
    const appointments = await Appointment.find({ doctor: doctorId });
    console.log(appointments);

    res.status(200).json({
      success: true,
      message: "Appointments Doctor",
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  addAppointment,
  getAllAppointments,
  getPatientAppointments,
  deleteAppointment,
  updateAppointment,
  getDoctorAppointments,
  getMyAppointments,
};
