import dotenv from "dotenv"
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
// import cors from "cors";

import { connectMongoose } from "./connection/mongo.js";
import authenticateUser from "./middleware/auth.js";

import userRouter from "./routes/user.js";
import dnsRouter from "./routes/dns.js";
import securityRouter from "./routes/security.js";
import oAuthRouter from "./routes/authRoutes.js"

const app = express();
const PORT = 3000;

connectMongoose(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DnsProject");

// app.use(
//   cors({
//     origin: "http://test.anthony.live", // Change to your frontend URL
//     credentials: true,
//   })
// );

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateUser);
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/dns", dnsRouter);
app.use("/api/security", securityRouter);
app.use("/api/auth",oAuthRouter);

app.listen(PORT, () => {
  try {
    console.log("server started at port : ", PORT);
  } catch (error) {
    console.log("server error : ", error);
  }
});
