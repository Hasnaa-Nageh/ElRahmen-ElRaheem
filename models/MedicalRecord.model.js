// models/MedicalRecord.js
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    visits: [
      {
        date: { type: Date, default: Date.now },
        symptoms: String, // المريض كان تعبان بإيه
        diagnosis: String, // التشخيص
        treatment: String, // العلاج أو الروشتة
        notes: String, // أي ملاحظات إضافية
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", recordSchema);
