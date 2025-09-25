const mongoose = require("mongoose");
const lapTestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    testType: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabTest", lapTestSchema);
