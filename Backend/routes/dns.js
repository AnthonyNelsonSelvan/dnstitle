import { Router } from "express";
import { handleCheckAvailability, handleCreateDomainName,handleDeleteDomainName,handleGetUserDomains } from "../controller/dns.js";
import validateWebsite from "../utils/validateWeb.js";

const router = Router();

router.post("/create-dns", handleCreateDomainName);

router.get("/check-availability", handleCheckAvailability);

router.get("/verify-ip",validateWebsite);

router.get("/userDomains",handleGetUserDomains);

router.delete("/deleteDomain",handleDeleteDomainName);

export default router;
