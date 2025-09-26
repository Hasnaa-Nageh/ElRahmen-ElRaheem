const express = require("express");
const router = express.Router();
const {
  addDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
} = require("./../controller/department.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post("/", authenticateToken, authorize("admin"), addDepartment);
router.get("/", authenticateToken, getAllDepartment);
router.get("/:id", authenticateToken, getSingleDepartment);
router.put("/:id", authenticateToken, authorize("admin"), updateDepartment);
router.delete("/:id", authenticateToken, authorize("admin"), deleteDepartment);

module.exports = router;
