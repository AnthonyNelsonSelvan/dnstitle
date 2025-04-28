import { Router } from "express";
import { handleLogout, handleTokenVerify } from "../controller/security.js";

const router = Router();

router.get("/token-verify", handleTokenVerify);

router.post("/logout", handleLogout);



export default router;
