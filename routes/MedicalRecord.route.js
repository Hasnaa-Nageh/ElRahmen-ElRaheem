const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const {
  getPatientHistory,
  AddVisit,
} = require("../controller/MedicalRecord.controller");
const router = express.Router();

//Doctor Add Visit
router.post(
  "/add-visit/:patientId",
  authenticateToken,
  authorize("doctor"),
  AddVisit
);
// Get history of a patient (by doctor)
router.get(
  "/patient-history/:patientId",
  authenticateToken,
  authorize("doctor", "patient", "admin"),
  getPatientHistory
);

module.exports = router;
