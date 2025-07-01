import { Router } from "express";
import { handleChangeForgottenPassword, handleForgotPasswordEmail, handleVerifyResetPasswordToken } from "../controller/password.js";

const router = Router();

router.post("/forgot-password", handleForgotPasswordEmail);

router.get("/verify-token/:token", handleVerifyResetPasswordToken);

router.post("/forgot-password/change/:token", handleChangeForgottenPassword);

export default router;
