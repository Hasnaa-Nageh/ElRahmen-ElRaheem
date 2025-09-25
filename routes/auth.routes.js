const express = require("express");
const {
  signup,
  login,
  logout,
  changePassword,
  refreshTokenController,
  me,
  forgetPassword,
  resetPassword,
} = require("../controller/auth.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", authenticateToken, changePassword);
router.post("/refresh-token", refreshTokenController);
router.get("/me", authenticateToken, me);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
