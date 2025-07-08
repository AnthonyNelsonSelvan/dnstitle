import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";
const LoginSecretKey = process.env.LOGIN_JWT_SECRET;
const EmailSecretKey = process.env.EMAIL_JWT_SECRET;

async function handleSignToken(token) {
  const signedToken = jwt.sign(
    { _id: token._id, username: token.username, email: token.email,isBanned : token.isBanned},
    LoginSecretKey
  );
  return signedToken;
}

async function handleSignEmailToken(email) {
  const signedToken = jwt.sign({ email: email }, EmailSecretKey);
  return signedToken;
} //for email verification cookie

async function handleVerifyToken(token) {
  try {
    const verified = jwt.verify(token, LoginSecretKey);
    return { valid: true, user: verified };
  } catch (err) {
    console.log("Token verification failed:", err.message); // Log the exact error message
    return { valid: false, error: err.message };
  }
}

export { handleSignToken, handleSignEmailToken, handleVerifyToken };
