import { handleVerifyToken } from "../utils/jwt.js";

const publicRoutes = [
  "/api/user/login",
  "/api/user/signup",
  "/api/password/forgot-password",
  "/api/password/verify-token",
  "/api/auth/google",
  "/api/verifyCaptcha",
  "/api/security",
];

async function authenticateUser(req, res, next) {
  try {
    if (publicRoutes.some((route) => req.path.startsWith(route))) {
      return next();
    }
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Please log in first." });
    }

    const verified = await handleVerifyToken(token);
    if (!verified) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    if (verified.isBanned) {
      return res
        .status(400)
        .json({ message: "Your Account has Been Banned Permenantly" });
    }
    req.user = verified;

    return next();
  } catch (error) {
    console.log("authentication error :", error);
  }
}

export default authenticateUser;
