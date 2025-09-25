const Lap = require("./../models/lapTest.model");
const Patient = require("./../models/patient.model");
const Doctor = require("./../models/doctor.model");

const addResult = async (req, res) => {
  try {
    const { patient, doctor, testType, result, notes } = req.body;

    if (!patient || !testType || !result) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }
    const labTest = await Lap.create({
      patient,
      doctor,
      testType,
      result,
      notes,
      lab: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Lab result added successfully",
      labTest,
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

const getPatientLabResults = async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await Lap.find({ patient: patientId })
      .populate("doctor", "fullname email phone")
      .populate("lab", "fullname email phone")
      .populate("patient", "fullname email phone")
      .sort({ createdAt: -1 });
    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "No lab results found for this patient",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      results,
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

const getDoctorPatientsLabResults = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const results = await Lap.find({ doctor: doctorId })
      .populate("patient", "fullname email phone")
      .populate("lab", "fullname email phone")
      .sort({ createdAt: -1 });

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "No lab results found for this doctor",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      results,
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

const getAllLabResults = async (req, res) => {
  try {
    const results = await Lap.find()
      .populate("patient", "fullname email phone")
      .populate("doctor", "fullname email phone")
      .populate("lab", "fullname email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
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

module.exports = {
  addResult,
  getPatientLabResults,
  getDoctorPatientsLabResults,
  getAllLabResults,
};
