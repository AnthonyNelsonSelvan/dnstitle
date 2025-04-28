import { Router } from "express";
import { handleSignUp,handleLogIn } from "../controller/user.js";

const router = Router();

router.post("/signup", handleSignUp);

router.post("/login", handleLogIn)

export default router;