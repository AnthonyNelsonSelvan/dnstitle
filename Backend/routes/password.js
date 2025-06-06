import { Router } from "express";
import User from "../model/user.js";
import sendEmail from "../services/email.services.js";
import crypto from "crypto";

const router = Router();

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    if (user.authType === "google" && !user.password)
      return res
        .status(403)
        .json({ message: "Password operation not allowed for oauth user" });
    const rawToken = user.createResetToken();
    await user.save();
    const resetSubject = "Dnstitle Reset Password..";
    const resetText = `click the link and reset the password, http://test.anthony.live/reset-password/${rawToken}`;
    const isSent = await sendEmail(email, resetSubject, resetText);
    if (!isSent) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      return res
        .status(400)
        .json({ message: "Something went wrong, try again later" });
    }
    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/verify-token/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const resetToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetToken: resetToken });
    if (!user)
      return res.status(403).json({ message: "invalid token or expired" });
    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Reset Token has been expired" });
    }
    return res.status(200).json({ message: "Verified" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

router.post("/forgot-password/change/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const resetToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetToken: resetToken });
    console.log(user);
    if (!user)
      return res.status(403).json({ message: "Invalid token or expired" });
    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Reset Token has been expired" });
    }
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("password change error ");
    return res.status(500).json({ message: "Internal server failure" });
  }
});

export default router;
