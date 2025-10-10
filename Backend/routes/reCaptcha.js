import { Router } from "express";
import verifyCaptcha from "../controller/reCaptcha.js";

const router = Router();

router.post("/verify",verifyCaptcha);

export default router;