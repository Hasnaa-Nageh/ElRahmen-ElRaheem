const Department = require("./../models/department.model");

const getAllDepartment = async (req, res) => {
  try {
    const department = await Department.find().sort({ name:1 });
    if (!department || department.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Department Found" });
    }

    res
      .status(200)
      .json({ success: true, message: "All Departments", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
const getSingleDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, message: "Department Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Department Found", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Department Name if Required" });
    }
    const department = new Department({
      name,
      createdBy: req.user?.id || null,
    });
    await department.save();
    res.status(201).json({
      success: true,
      message: "Department Added Successfully",
      department,
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
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, message: "No Department Found" });
    }
    res.status(201).json({
      success: true,
      message: "Department Updated Successfully",
      department,
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
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, message: "No Department Found" });
    }
    res.status(201).json({
      success: true,
      message: "Department Deleted Successfully",
      department,
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
  addDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
