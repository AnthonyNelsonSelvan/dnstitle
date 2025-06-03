import { handleVerifyToken } from "../utils/jwt.js";

const publicRoutes = ["/user/login", "/user/signup"]

async function authenticateUser(req, res, next) {
  try {
    if(publicRoutes.includes(req.path)){
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
