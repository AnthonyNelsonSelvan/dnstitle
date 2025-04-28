import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectMongoose } from "./connection/mongo.js";
import authenticateUser from "./middleware/auth.js";

import userRouter from "./routes/user.js";
import dnsRouter from "./routes/dns.js";
import staticRouter from "./routes/static.js";
import securityRouter from "./routes/security.js";

const app = express();
const PORT = 3000;

connectMongoose("mongodb://127.0.0.1:27017/DnsProject");

app.use(
  cors({
    origin: "http://localhost:5173", // Change to your frontend URL
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateUser);


app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/user", userRouter);
app.use("/dns", dnsRouter);
app.use("/security", securityRouter);
app.use("/", staticRouter);

app.listen(PORT, () => {
  try {
    console.log("server started at port : ", PORT);
  } catch (error) {
    console.log("server error : ", error);
  }
});
