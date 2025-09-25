const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");
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

router.get("/get-doctors", authenticateToken, getAllDoctors);

router.get("/get-single-doctor/:id", authenticateToken, getSingleDoctor);
// Add Doctor
router.post(
  "/add-doctor",
  authenticateToken,
  authorize("admin"),
  upload.single("image"),
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
