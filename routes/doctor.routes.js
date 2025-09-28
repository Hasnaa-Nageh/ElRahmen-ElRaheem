const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const {uploadDoc} = require("../middleware/upload.middleware");
const {
  addDoctor,
  getAllDoctors,
  getSingleDoctor,
  deleteDoctor,
  updateDoctor,
  searchDoctor,
} = require("../controller/doctor.controller");

const router = express.Router();

router.get("/search", authenticateToken, searchDoctor);

router.get("/get-doctors", getAllDoctors);

router.get("/get-single-doctor/:id", getSingleDoctor);
// Add Doctor
router.post(
  "/add-doctor",
  authenticateToken,
  authorize("admin"),
  uploadDoc.single("image"),
  addDoctor
);

router.put(
  "/update-patient/:id",
  authenticateToken,
  authorize("admin"),
  updateDoctor
);

router.delete(
  "/delete-doctor/:id",
  authenticateToken,
  authorize("admin"),
  deleteDoctor
);

module.exports = router;
