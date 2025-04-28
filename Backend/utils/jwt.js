import jwt from "jsonwebtoken";
const SecretKey = "f54re6f54wr6f";

async function handleSignToken(token) {
  const signedToken = jwt.sign(
    { _id: token._id, username: token.username, email: token.email },
    SecretKey
  );
  console.log(signedToken);
  return signedToken;
}

async function handleVerifyToken(token) {
  try {
    const verified = jwt.verify(token, SecretKey);
    console.log("Token verified:", verified); // Logs the verified token data
    return { valid: true, user: verified };
  } catch (err) {
    console.log("Token verification failed:", err.message); // Log the exact error message
    return { valid: false, error: err.message };
  }
}

export { handleSignToken, handleVerifyToken };
