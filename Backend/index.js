import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

import { connectMongoose } from "./connection/mongo.js";
import authenticateUser from "./middleware/auth.js";

import userRouter from "./routes/user.js";
import dnsRouter from "./routes/dns.js";
import securityRouter from "./routes/security.js";
import oAuthRouter from "./routes/authRoutes.js";
import passwordRouter from "./routes/password.js";
import adminRouter from "./routes/admim.js";
import { dnsLimiter, globalLimiter, loginLimiter, passLimiter, securityLimiter } from "./middleware/rateLimit.js";

const app = express();
const PORT = 3000;

connectMongoose(
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DnsProject"
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateUser);
app.use(express.json());
app.use(globalLimiter);

app.use("/api/user",loginLimiter, userRouter);
app.use("/api/dns",dnsLimiter, dnsRouter);
app.use("/api/security",securityLimiter, securityRouter);
app.use("/api/auth",loginLimiter, oAuthRouter);
app.use("/api/password",passLimiter, passwordRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  try {
    console.log("server started at port : ", PORT);
  } catch (error) {
    console.log("server error : ", error);
  }
});
