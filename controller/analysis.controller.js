const User = require("./../models/user.model");

const addAnalysis = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;

    if (!fullname || !email || !password || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    let normalizedEmail = email.trim().toLowerCase();

    let existEmail = await User.findOne({ email: normalizedEmail });
    let existPhone = await User.findOne({ phone });

    if (existEmail || existPhone) {
      return res.status(400).json({
        success: false,
        message: "Analysis Doctor already exists",
      });
    }

    const user = new User({
      fullname,
      email: normalizedEmail,
      password,
      phone,
      role: "lab",
      createdBy: req.user?.id || null,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Analysis doctor added successfully",
      user,
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

const searchAnalysis = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const analysisDoc = await User.find({
      role: "lab",
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    }).select("-password -refreshToken");

    if (!analysisDoc.length) {
      return res
        .status(404)
        .json({ success: false, message: "No Analysis Doctor Found" });
    }

    res.status(200).json({
      success: true,
      count: analysisDoc.length,
      labs: analysisDoc,
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

const getAllAnalysis = async (req, res) => {
  try {
    const labs = await User.find({ role: "lab" }).select(
      "-password -refreshToken"
    );
    if (!labs) {
      return res
        .status(400)
        .json({ success: false, message: "Analysis Doctor Not Found" });
    }
    res.status(200).json({ success: true, message: "Analysis Labs", labs });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getSingleAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    let lab = await User.findById({ _id: id, role: "lab" }).select(
      "-password -refreshToken"
    );
    if (!lab) {
      return res
        .status(400)
        .json({ success: false, message: "Analysis Doctor Not Found" });
    }
    res.status(200).json({ success: true, message: "Analysis Labs", lab });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const updateAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    let lab = await User.findOneAndUpdate(
      { _id: id, role: "lab" },
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!lab) {
      return res
        .status(400)
        .json({ success: false, message: "Analysis Doctor Not Found" });
    }
    res.status(200).json({ success: true, message: "Analysis Labs", lab });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    let lab = await User.findOneAndDelete({ _id: id, role: "lab" }).select(
      "-password -refreshToken"
    );
    if (!lab) {
      return res
        .status(404)
        .json({ success: false, message: "Analysis Doctor Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Analysis Doctor Deleted Successfully",
      lab,
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
  searchAnalysis,
  getAllAnalysis,
  getSingleAnalysis,
  addAnalysis,
  updateAnalysis,
  deleteAnalysis,
};
