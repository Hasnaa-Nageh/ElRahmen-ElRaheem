const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const router = express.Router();
const {
  addResult,
  getPatientLabResults,
  getDoctorPatientsLabResults,
  getAllLabResults,
} = require("./../controller/lapTest.controller");

router.post(
  "/add-lab",
  authenticateToken,
  authorize("admin", "lab"),
  addResult
);

router.get(
  "/my-result/:patientId",
  authenticateToken,
  authorize("user", "patient"),
  getPatientLabResults
);

router.get(
  "/doctor-result-patient",
  authenticateToken,
  authorize("doctor"),
  getDoctorPatientsLabResults
);

router.get(
  "/admin-result-patient",
  authenticateToken,
  authorize("admin"),
  getAllLabResults
);

module.exports = router;
