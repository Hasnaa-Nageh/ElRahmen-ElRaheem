const Patient = require("./../models/patient.model");

const addPatient = async (req, res) => {
  try {
    const { fullname, phone, dateOfBirth, gender, address, notes } = req.body;
    if (!fullname || !phone || !dateOfBirth || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }
    const existPatient = await Patient.findOne({ phone });
    if (existPatient) {
      return res
        .status(400)
        .json({ success: false, message: "Patient already exists" });
    }
    const patient = await Patient.create({
      fullname,
      phone,
      dateOfBirth,
      gender,
      address,
      notes,
      createdBy: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, message: "Patient added successfully", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getAllPatient = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    if (!patients) {
      return res
        .status(400)
        .json({ success: false, message: "No Patient Found" });
    }
    res.status(200).json({ success: true, message: "All Patients", patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getSinglePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res
        .status(400)
        .json({ success: false, message: "No Patient Found" });
    }
    res.status(200).json({ success: true, message: "Patient Found", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res
        .status(400)
        .json({ success: false, message: "No Patient Found" });
    }
    res.status(201).json({
      success: true,
      message: "Patient Updated Successfully",
      patient,
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

const searchPatient = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const patients = await Patient.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res
        .status(400)
        .json({ success: false, message: "No Patient Found" });
    }
    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully",
      patient,
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
  addPatient,
  getAllPatient,
  getSinglePatient,
  deletePatient,
  updatePatient,
  searchPatient,
};
