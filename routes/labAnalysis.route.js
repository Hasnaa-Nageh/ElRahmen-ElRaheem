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

router.get("/search", searchAnalysis);
router.get("/get-All-analysis", getAllAnalysis);
router.get("/get-single-analysis/:id", getSingleAnalysis);
router.post("/add-analysis", addAnalysis);
router.put("/update-analysis", updateAnalysis);
router.delete("/delete-analysis", deleteAnalysis);

module.exports = router;
