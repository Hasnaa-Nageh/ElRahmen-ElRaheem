const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const receptionSchema = new mongoose.Schema(
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
    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: ["reception"],
      default: "reception",
    },

    notes: {
      type: String,
      default: "",
    },
    passwordChangeAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
receptionSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    if (!this.isNew) {
      this.passwordChangeAt = Date.now();
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("reception", receptionSchema);
