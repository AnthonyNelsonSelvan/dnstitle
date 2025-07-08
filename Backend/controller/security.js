import { handleVerifyToken } from "../utils/jwt.js";
import User from "../model/user.js";
import sendEmailJob from "../queue/email.job.js";
import { handleSignEmailToken } from "../utils/jwt.js";
import TempUser from "../model/temp.user.js";
import { handleFuncGenerateKey } from "../utils/generateKey.js";
import redis from "../connection/redisClient.js";

async function handleTokenVerify(req, res) {
  let token = req.cookies?.token;
  if (!token) {
    return res.status(400).json({ message: "no token recieved" });
  }
  let verified = await handleVerifyToken(token);
  if (!verified) {
    return res.status(400).json({ valid: false });
  }
  return res.status(200).json({ user: verified });
}

function handleLogout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
} //change needed in this before deployment

async function handleVerifyEmail(req, res) {
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
}

async function handleVerifyConfirmEmail(req, res) {
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
    return res.status(200).json({
      message:
        "Verified successfully ,go back to the site and continue signing up.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function handleGenerateKey(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please Login First." });
  }
  try {
    const Key = handleFuncGenerateKey(10);
    console.log(Key);
    await redis.set(`Verify:${id}`, `${Key}`, "EX", 3600);
    return res.status(200).json({ secret: Key });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went Wrong." });
  }
}

async function handleWebVerifyKey(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please Login First." });
  }
  try {
    const secretKey = await redis.get(`Verify:${id}`);
    if (!secretKey) return res.status(404).json({ secret: "" });
    return res.status(200).json({ secret: secretKey });
  } catch (error) {}
}

export {
  handleTokenVerify,
  handleLogout,
  handleVerifyEmail,
  handleVerifyConfirmEmail,
  handleGenerateKey,
  handleWebVerifyKey,
};
