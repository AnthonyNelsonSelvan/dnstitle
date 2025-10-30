import sendEmailJob from "../queue/email.job.js";
import User from "../model/user.js";
import crypto from "crypto";

async function handleForgotPasswordEmail(req, res) {
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
    const isSent = await sendEmailJob(email, resetSubject, resetText);
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
}

async function handleVerifyResetPasswordToken(req, res) {
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
}

async function handleChangeForgottenPassword(req, res) {
  try {
    const { password } = req.body;
    console.log(password)
    const token = req.params.token;
    const resetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({ resetToken: resetToken });
    console.log(user);
    if (!user)
      return res.status(403).json({ message: "Invalid token or expired" });
    if (user.resetTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({ message: "Reset Token has been expired" });
    }
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went Wrong." });
  }
};

export {
  handleForgotPasswordEmail,
  handleVerifyResetPasswordToken,
  handleChangeForgottenPassword,
};
