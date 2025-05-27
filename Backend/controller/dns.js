import DNS from "../model/dns.js";
import { addDomainBind, deleteDomainBind } from "../services/dns.services.js";
import profanityCheck from "../utils/profanity.js";

async function handleCreateDomainName(req, res) {
  try {
    const { dnsName, publicIp, userRef, recordType } = req.body;
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
      const isDone = await addDomainBind(dnsName, publicIp);
      if(isDone){
        console.log("it is done added")
        //maybe alert it is done or not
      }else{
        await DNS.deleteOne({dnsName : dns.dnsName})
        console.log("not Done")
        return
      }
    }

    return res.status(200).json({
      message: "All set!! WELCOME, Don't forget to renew it every month",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went Wrong" });
  }
}

async function handleDeleteDomainName(req,res) {
  try {
    const {dnsName , userRef} = req.body;
    const dns = await DNS.findOne({dnsName : dnsName});
    if(!dns){
      return res.status(404).json({message : "Domain Name Not Found"})
    }
    if(dns.userRef.equals(userRef)){
      return res.status(403).json({message : "User Verification Failed"});
    }
    const isDone = await deleteDomainBind(dnsName);
    if(isDone){
      await DNS.deleteOne({dnsName : dns.dnsName})
      console.log("Deleted")
    }else{
      //maybe alert it is done or not
      console.log("not Done")
      return
    }

    return res.status(200).json({message : "Successfully Removed"})

  } catch (error) {
    console.log(error);
    return res.status(500).json({message : " Something went wrong"})
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
    const { _id } = req.query;
    const response = await DNS.find({ userRef: _id });
    return res.status(200).json(response);
  } catch (error) {}
}

export {
  handleCreateDomainName,
  handleCheckAvailability,
  handleGetUserDomains,
  handleDeleteDomainName,
};
