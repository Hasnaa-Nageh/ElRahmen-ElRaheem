const Reception = require("./../models/reception.model");

const addReception = async (req, res) => {
  try {
    const { fullname, email, phone, password, notes } = req.body;

    let normalizeEmail = email.trim().toLowerCase();

    let existEmail = await Reception.findOne({ email: normalizeEmail });
    let existPhone = await Reception.findOne({ phone });

    if (!fullname || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (existEmail || existPhone) {
      return res.status(400).json({
        success: false,
        message: "Receptionist already exists",
      });
    }

    const reception = new Reception({
      fullname,
      email: normalizeEmail,
      phone,
      password,
      notes,
    });

    await reception.save();

    res.status(201).json({
      success: true,
      message: "Receptionist Added Successfully",
      reception,
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

const searchReception = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is Required" });
    }
    const reception = await Reception.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    });
    res
      .status(200)
      .json({ success: true, message: "Receptionist Found", reception });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getAllReception = async (req, res) => {
  try {
    const reception = await Reception.find().sort({ fullname: 1 });
    if (!reception) {
      return res
        .status(400)
        .json({ success: false, message: "No Receptionist Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "All Receptionist", reception });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getSingleReception = async (req, res) => {
  try {
    let { id } = req.params;
    const reception = await Reception.findById(id);
    if (!reception) {
      return res
        .status(400)
        .json({ success: "false", message: "No Receptionist Found" });
    }
    res
      .status(201)
      .json({ success: true, message: "get Single Receptionist", reception });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const updateReception = async (req, res) => {
  try {
    const { id } = req.params;
    const reception = await Reception.findByIdAndUpdate(id, req.body);
    if (!reception) {
      return res
        .status(400)
        .json({ success: false, message: "No Receptionist Found" });
    }
    res.status(201).json({
      success: true,
      message: "Receptionist Updated Successfully",
      reception,
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

const deleteReception = async (req, res) => {
  try {
    let { id } = req.params;
    const reception = await Reception.findByIdAndDelete(id);
    if (!reception) {
      return res
        .status(404)
        .json({ success: false, message: "No Receptionist Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Receptionist Deleted Successfully" });
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
  searchReception,
  addReception,
  getAllReception,
  getSingleReception,
  updateReception,
  deleteReception,
};
