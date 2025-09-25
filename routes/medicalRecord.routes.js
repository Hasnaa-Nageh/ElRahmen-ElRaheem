const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const { AddVisit } = require("../controller/MedicalRecord.controller");
const router = express.Router();

router.post(
  "/add-visit/:patientId",
  authenticateToken,
  authorize("doctor"),
  AddVisit
);

module.exports = router;
