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

app.post("/", authenticateToken, authorize("admin"), addDepartment);
app.get("/", authenticateToken, getAllDepartment);
app.get("/:id", authenticateToken, getSingleDepartment);
app.put("/:id", authenticateToken, authorize("admin"), updateDepartment);
app.delete("/:id", authenticateToken, authorize("admin"), deleteDepartment);
module.exports = router;
