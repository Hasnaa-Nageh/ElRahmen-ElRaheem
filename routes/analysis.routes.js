const express = require("express");
const router = express.Router();
const {
  searchAnalysis,
  getAllAnalysis,
  getSingleAnalysis,
  addAnalysis,
  updateAnalysis,
  deleteAnalysis,
} = require("./../controller/analysis.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");

router.get("/search", authenticateToken, authorize("admin"), searchAnalysis);
router.get(
  "/get-all-analysis",
  authenticateToken,
  authorize("admin"),
  getAllAnalysis
);

router.get(
  "/get-single-analysis/:id",
  authenticateToken,
  authorize("admin"),
  getSingleAnalysis
);

router.post("/add-analysis", authenticateToken, authorize("admin"), addAnalysis);

router.put(
  "/update-analysis/:id",
  authenticateToken,
  authorize("admin"),
  updateAnalysis
);

router.delete(
  "/delete-analysis/:id",
  authenticateToken,
  authorize("admin"),
  deleteAnalysis
);

module.exports = router;
