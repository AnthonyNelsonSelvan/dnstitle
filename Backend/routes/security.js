import { Router } from "express";
import { handleLogout, handleTokenVerify, handleVerifyConfirmEmail, handleVerifyEmail, handleGenerateKey, handleWebVerifyKey } from "../controller/security.js";


const router = Router();

router.get("/token-verify", handleTokenVerify);

router.post("/logout", handleLogout);

router.post("/email-verification", handleVerifyEmail);

router.post("/is-email-verified/:email/:token", handleVerifyConfirmEmail);

router.post("/generate-key/:id", handleGenerateKey);

router.get("/get-web-verify-key/:id", handleWebVerifyKey);

export default router;
