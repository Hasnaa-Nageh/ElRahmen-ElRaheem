const User = require("./../models/user.model");
const Doctor = require("./../models/doctor.model");
const Patient = require("./../models/patient.model");
const Reception = require("./../models/reception.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

// Sign Up
const signup = async (req, res, next) => {
  try {
    const { fullname, email, password, phone, gender, dateOfBirth } = req.body;

    if (!fullname || !email || !password || !phone || !gender || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizeEmail = email.trim().toLowerCase();
    const existUser = await User.findOne({ email: normalizeEmail });
    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      fullname,
      email: normalizeEmail,
      password,
      phone,
      role: "patient",
    });

    const newPatient = await Patient.create({
      createdBy: newUser._id,
      fullname,
      phone,
      gender,
      dateOfBirth,
    });

    newUser.patientProfile = newPatient._id;
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, refreshToken: __, ...userData } = newUser.toObject();

    res
      .status(201)
      .json({ success: "true", message: "Signup successful", user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

//login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );
    if (!user) {
      user = await Doctor.findOne({ email: normalizedEmail }).select(
        "+password"
      );
    }
    if (!user) {
      user = await Reception.findOne({ email: normalizedEmail }).select(
        "+password"
      );
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log("Login req.body.password:", password);
    console.log("User.password (hash):", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minute
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, refreshToken: rt, ...userData } = user.toObject();
    userData.role = user.role;
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};
//logout
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// change Password
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword; // Middleware will hash this
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Refresh Token
const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    console.log(
      "Manual refresh request with token:",
      refreshToken.substring(0, 20) + "..."
    );

    // Verify the refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log("Refresh token verified for user:", payload.id);
    } catch (err) {
      console.log("Refresh token verification failed:", err.message);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Find user by ID
    const user = await User.findById(payload.id);
    if (!user) {
      console.log("User not found for ID:", payload.id);
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if stored refresh token matches
    if (user.refreshToken !== refreshToken) {
      console.log("Stored refresh token doesn't match");
      return res.status(403).json({
        success: false,
        message: "Refresh token does not match",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    console.log("New access token generated");

    // Set the new access token as a cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 60 * 1000, // 1 minute
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
      expiresIn: "1 minute",
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

const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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

// Forget Password
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    // hash Password Before Saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Support" <support@example.com>',
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
    });
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
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
  signup,
  login,
  logout,
  changePassword,
  refreshTokenController,
  me,
  forgetPassword,
  resetPassword,
};
