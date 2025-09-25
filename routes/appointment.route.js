const express = require("express");
const {
  addAppointment,
  getAllAppointments,
  getPatientAppointments,
  deleteAppointment,
  updateAppointment,
  getDoctorAppointments,
  getMyAppointments,
} = require("./../controller/appointment.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const router = express.Router();

router.post(
  "/add-appointment",
  authenticateToken,
  authorize("patient", "admin", "reception"),
  addAppointment
);
router.get(
  "/get-all-appointment",
  authenticateToken,
  authorize("admin", "reception"),
  getAllAppointments
);
// get appointment for specific patient
router.get(
  "/patient/:id",
  authenticateToken,
  authorize("admin", "reception", "patient"),
  getPatientAppointments
);
// get appointment for doctor
router.get(
  "/doctor/:id",
  authenticateToken,
  authorize("admin", "doctor"),
  getDoctorAppointments
);

// get my appointment
router.get("/my", authenticateToken, getMyAppointments);

// update appointment
router.put(
  "/update-appointment/:id",
  authenticateToken,
  authorize("admin", "reception"),
  updateAppointment
);

// delete appointment
router.delete(
  "/delete-appointment/:id",
  authenticateToken,
  authorize("admin"),
  deleteAppointment
);

module.exports = router;
