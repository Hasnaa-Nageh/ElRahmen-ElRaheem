const Doctor = require("./../models/doctor.model");
const Patient = require("./../models/patient.model");
const MedicalRecord = require("./../models/MedicalRecord.model");
const AddVisit = async (req, res) => {
  try {
    const { symptoms, diagnosis, treatment, notes } = req.body;
    const { patientId } = req.params;
    const doctorId = req.user.id;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    let record = await MedicalRecord.findOne({
      patient: patientId,
      doctor: doctorId,
    });

    if (!record) {
      record = new MedicalRecord({
        patient: patientId,
        doctor: doctorId,
        visits: [{ symptoms, diagnosis, treatment, notes }],
      });
    } else {
      record.visits.push({ symptoms, diagnosis, treatment, notes });
    }

    await record.save();

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error("AddVisit error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!req.user || req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can view patient history",
      });
    }

    const doctorId = req.user._id || req.user.id;

    const record = await MedicalRecord.findOne({
      patient: patientId,
      doctor: doctorId,
    });

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "No history found" });
    }

    res.json({ success: true, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


module.exports = { AddVisit, getPatientHistory };
