const Doctor = require("../models/doctor.model");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const addDoctor = async (req, res) => {
  try {
    let {
      fullname,
      email,
      password,
      phone,
      specialization,
      availableDays,
      availableTimes,
      notes,
      image,
    } = req.body;

    // normalize email (remove spaces + lowercase)
    let normalizedEmail = email.trim().toLowerCase();

    // check if email or phone already exists
    let existEmail = await Doctor.findOne({ email: normalizedEmail });
    let existPhone = await Doctor.findOne({ phone });

    if (existEmail || existPhone) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    // handle availableDays
    if (typeof availableDays === "string") {
      try {
        availableDays = JSON.parse(availableDays);
      } catch {
        availableDays = [];
      }
    }

    // handle availableTimes
    if (typeof availableTimes === "string") {
      try {
        availableTimes = JSON.parse(availableTimes);
      } catch {
        availableTimes = [];
      }
    }

    // handle image upload (Base64)
    const imagePath = req.file ? `/uploads/doctors/${req.file.filename}` : "";
    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const doctor = new Doctor({
      fullname,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      specialization,
      availableDays,
      availableTimes,
      notes,
      image: imagePath,
      createdBy: req.user?.id || null,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
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

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ fullname: 1 });
    if (!doctors) {
      return res
        .status(400)
        .json({ success: false, message: "No Doctor Found" });
    }
    res.status(200).json({ success: true, message: "All Doctors", doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getSingleDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor Not Found" });
    }
    res.status(200).json({ success: true, message: "Doctor Found", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res
        .status(400)
        .json({ success: false, message: "No Patient Found" });
    }
    res.status(201).json({
      success: true,
      message: "Doctor Updated Successfully",
      doctor,
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

const searchDoctor = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }
    const doctors = await Doctor.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    //verify for id
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format",
      });
    }

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "No Doctor Found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully",
      doctor,
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
  addDoctor,
  getAllDoctors,
  getSingleDoctor,
  deleteDoctor,
  updateDoctor,
  searchDoctor,
};
