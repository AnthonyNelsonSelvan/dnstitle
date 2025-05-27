import User from "../model/user.js";
import { setCookie } from "../utils/cookie.js";
import { handleVerifyPass } from "../utils/pass.js";
import { handleSignToken } from "../utils/jwt.js";

async function handleSignUp(req, res) {
  try {
    const { email,password } = req.body;

    const existingUser = await User.findOne( { email : email } );
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const user = await User.create({
      authId : email,
      password,
      email,
    });
    console.log(user);

    if (user) {
      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(400).json({ message: "Error creating account" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating an account. Please try again later.",
    });
  }
}

async function handleLogIn(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
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
        .json({ message: "Incorrect username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
}

export { handleSignUp, handleLogIn };
