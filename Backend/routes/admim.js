import { Router } from "express";
import User from "../model/user.js";
import DNS from "../model/dns.js";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const { id, domainName } = req.query;
    if (!id) return res.status(403).json({ message: "Forbidden" });
    const isAdmin = await User.findById(id);
    if (!isAdmin || isAdmin.Role === "USER")
      return res.status(403).json({ message: "Forbidden" });
    const dns = await DNS.findOne({ dnsName: domainName });
    const user = await User.findById(dns.userRef)
    return res.status(200).json({ data: dns,userData: user});
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;