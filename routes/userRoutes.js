const express = require("express");
const { register, login, getProfile, sendResetEmail, resetPassword, verifyEmail, logout } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", logout);  
router.post("/send-reset-email", sendResetEmail);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
