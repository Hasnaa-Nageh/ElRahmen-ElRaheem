const express = require("express");
const {
  addPatient,
  getAllPatient,
  getSinglePatient,
  deletePatient,
  updatePatient,
  searchPatient,
} = require("../controller/patient.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const router = express.Router();


router.get(
  "/search",
  authenticateToken,
  authorize("doctor", "reception", "admin"),
  searchPatient
);

router.get(
  "/get-patient",
  authenticateToken,
  authorize("admin", "reception"),
  getAllPatient
);

router.get(
  "/get-single-patient/:id",
  authenticateToken,
  authorize("admin", "reception"),
  getSinglePatient
);


router.post(
  "/add-patient",
  authenticateToken,
  authorize("admin", "reception"),
  addPatient
);

router.put(
  "/update-patient/:id",
  authenticateToken,
  authorize("admin", "reception"),
  updatePatient
);

router.delete(
  "/delete-patient/:id",
  authenticateToken,
  authorize("admin", "patient"),
  deletePatient
);

module.exports = router;
