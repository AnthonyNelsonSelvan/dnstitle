import { handleVerifyToken } from "../utils/jwt.js";

const publicRoutes = ["/api/user/login", "/api/user/signup","/api/password/forgot-password","/api/password/verify-token"]

async function authenticateUser(req, res, next) {
  try {
    if(publicRoutes.some(route => req.path.startsWith(route))){
      return next();
    }
    const token = req.cookies?.token;
    if (!token) {
      console.log("login first")//will do something here
    }

    const verified = await handleVerifyToken(token);
    if (!verified) {
      return console.log("login second")//here too
    }

    req.user = verified;

    return next();
  } catch (error) {
    console.log("authentication error :", error);
  }
}

export default authenticateUser;
