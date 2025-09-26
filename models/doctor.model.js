const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const doctorSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true, // "orthopedic", "emergency", "cardiology"
    },
    availableDays: {
      type: [String], // ["sunday", "monday", ...]
      default: [],
    },
    availableTimes: {
      type: [String], // ["09:00-12:00", "15:00-18:00"]
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    password: { type: String, required: true, minlength: 6 },
    passwordChangeAt: Date,
    role: {
      type: String,
      enum: ["user", "doctor", "admin", "reception"],
      default: "doctor",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("doctor", doctorSchema);
