import DNS from "../model/dns.js";
import { addDomainBind } from "../services/dns.services.js";
import profanityCheck from "../utils/profanity.js";

async function handleCreateDomainName(req, res) {
  try {
    const { dnsName, publicIp, userRef, recordType } = await req.body;
    if (!dnsName && !publicIp && !type) {
      return res
        .status(400)
        .json({ message: "all fields are required to fill" });
    }
    if (!userRef) {
      return res.status(400).json({
        message:
          "please login or signup before trying to make your domain name",
      });
    }
    const dns = await DNS.create({
      dnsName,
      publicIp,
      recordType,
      userRef,
    });

    if(dns){
      addDomainBind()
    }

    return res.status(200).json({
      message: "All set!! WELCOME, Don't forget to renew it every month",
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Something went Wrong" });
  }
}

async function handleCheckAvailability(req, res) {
  try {
    const { dns } = req.query;
    if (profanityCheck(dns))
      return res.status(400).json({
        message:
          "Your domain contains illegal or some forbidden to use word. Choose any other name...",
      });
    const dnsA = await DNS.findOne({ dnsName: dns });
    if (!dnsA) {
      return res.status(200).json({ message: "domain name available" });
    } else {
      return res.status(400).json({ message: "sorry this name is taken" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
}

async function handleGetUserDomains(req, res) {
  try {
    console.log("start");
    const { _id } = req.query;
    console.log("user", _id);
    const response = await DNS.find({ userRef: _id });
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {}
}

export {
  handleCreateDomainName,
  handleCheckAvailability,
  handleGetUserDomains,
};
