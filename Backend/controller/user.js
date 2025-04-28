import User from "../model/User.js";
import { setCookie } from "../utils/cookie.js";
import { handleVerifyPass } from "../utils/pass.js";
import { handleSignToken } from "../utils/jwt.js";

async function handleSignUp(req, res) {
  try {
    const { username, password, email } = req.body;
    const user = await User.create({
      username,
      password,
      email,
    });
    console.log(user);
    if (user) {
      return res.status(200).json({ message: "success" });
    } else {
      return res
        .status(400)
        .json({ message: "email or username already exist" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "error creating an account please try few hours later",
      });
  }
}

async function handleLogIn(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: username }, { username: username }],
  });
  if (!user) {
    return res.status(400).json({ message: "Incorrect username or password" });
  }
  try {
    const isMatch = await handleVerifyPass(user.password, password);
    if (isMatch) {
      const cookieToken = await handleSignToken(user);
      setCookie(res, cookieToken);
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ message: "username or password incorrect" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { handleSignUp, handleLogIn };
