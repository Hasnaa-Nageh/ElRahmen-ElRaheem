const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    appointmentDate: { type: Date, required: true }, // Date + Time
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      default: "",
    },
    // createdBy: {
    //   type: mongoose.Types.ObjectId,
    //   required: true,
    //   refPath: "createdByModel",
    // },
    // createdByModel: {
    //   type: String,
    //   required: true,
    //   enum: ["user", "patient", "reception"],
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointment", appointmentSchema);
