import { Router } from "express";
import User from "../model/user.js";
import sendEmail from "../services/email.services.js";

const router = Router();

let user;

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const rawToken = user.createResetToken();
    await user.save();
    const resetSubject = "Dnstitle Reset Password..";
    const resetText = `click the link and reset the password, http://test.anthony.live/api/password/reset-password/${rawToken}`;
    const isSent = await sendEmail(email, resetSubject, resetText);
    if (!isSent) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      return res
        .status(400)
        .json({ message: "something went wrong, try again later" });
    }
    return res.status(200).json({ message: "email sent successfully" });
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/reset-password/:token", (req, res) => {
    res.status(200).json({message : "you did it now we can reset the password"})
});

export default router;
