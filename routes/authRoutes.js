const express = require("express");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../services/emailService");
const User = require("../models/User");

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "E-mail não encontrado." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hora de validade
  await user.save();

  await sendResetPasswordEmail(email, resetToken);
  
  res.json({ message: "Se este e-mail estiver cadastrado, um link de redefinição foi enviado." });
});

module.exports = router;
