const express = require("express");
const router = express.Router();
const {
  searchReception,
  addReception,
  getAllReception,
  getSingleReception,
  updateReception,
  deleteReception,
} = require("./../controller/reception.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");

router.get("/search", authenticateToken, authorize("admin"), searchReception);
router.get(
  "/get-all-reception",
  authenticateToken,
  authorize("admin"),
  getAllReception
);
router.get(
  "/get-single-reception/:id",
  authenticateToken,
  authorize("admin"),
  getSingleReception
);
router.post(
  "/add-reception",
  authenticateToken,
  authorize("admin"),
  addReception
);
router.put(
  "/update-reception/:id",
  authenticateToken,
  authorize("admin"),
  updateReception
);
router.delete(
  "/delete-reception/:id",
  authenticateToken,
  authorize("admin"),
  deleteReception
);

module.exports = router;
