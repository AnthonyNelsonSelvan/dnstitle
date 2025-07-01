import { Router } from "express";
import { handleLogout, handleTokenVerify } from "../controller/security.js";
import { handleSignEmailToken } from "../utils/jwt.js";
import TempUser from "../model/temp.user.js";
import User from "../model/user.js";
import sendEmailJob from "../queue/email.job.js";
import redis from "../connection/redisClient.js";
import { handleGenerateKey } from "../utils/generateKey.js";

const router = Router();

router.get("/token-verify", handleTokenVerify);

router.post("/logout", handleLogout);

router.post("/email-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "Email already exist" });
    }
    const checkpreuse = await TempUser.findOne({ email: email });
    if (checkpreuse) {
      if (checkpreuse.isVerified === true) {
        return res.status(201).json({ message: "Verified" });
      }
      if (checkpreuse.isVerified === false) {
        await TempUser.deleteOne({ email: email });
      }
    }
    const jwt = await handleSignEmailToken(email);
    await TempUser.create({
      email: email,
      token: jwt,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    });
    const resetSubject = "Verifying email";
    const resetText = `verification email please ignore this if you don't know what is this : http://test.anthony.live/verify-email-page/${email}/${jwt}`;
    const isSent = await sendEmailJob(email, resetSubject, resetText);
    if (!isSent) {
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

router.post("/is-email-verified/:email/:token", async (req, res) => {
  try {
    const { email, token } = req.params;
    const tuser = await TempUser.findOne({ token: token });
    if (!tuser) {
      return res.status(400).json({ message: "link invalid or expired" });
    }
    if (tuser.email !== email) {
      return res.status(400).json({ message: "Something went Wrong" });
    }
    tuser.isVerified = true;
    await tuser.save();
    return res
      .status(200)
      .json({
        message:
          "Verified successfully ,go back to the site and continue signing up.",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/generate-key/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please Login First." });
  }
  try {
    const Key = handleGenerateKey(10);
    console.log(Key);
    await redis.set(`Verify:${id}`, `${Key}`);
    return res.status(200).json({ secret: Key });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went Wrong." });
  }
});

router.get("/get-web-verify-key/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please Login First." });
  }
  try {
    const secretKey = await redis.get(`Verify:${id}`);
    if (!secretKey) return res.status(404).json({ secret: "" });
    return res.status(200).json({ secret: secretKey });
  } catch (error) {}
});

export default router;
