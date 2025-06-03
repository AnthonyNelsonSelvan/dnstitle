import { handleVerifyToken } from "../utils/jwt.js";

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
      res.status(500).json({ message : "Logout failed" });
    }
  };//change needed in this before deployment  



export { handleTokenVerify, handleLogout };
