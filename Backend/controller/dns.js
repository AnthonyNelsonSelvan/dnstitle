import DNS from "../model/dns.js";
import DomainLimit from "../model/dns.limit.js";
import sendBindJob from "../queue/bindUpdate.job.js";
import profanityCheck from "../utils/profanity.js";
import guessRecordType from "../utils/recordType.js";

async function handleCreateDomainName(req, res) {
  try {
    const { dnsName, publicIp, userRef, recordType } = req.body;
    if (!dnsName && !publicIp && !recordType) {
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
    const isCorrectRecordType = guessRecordType(publicIp);
    if (isCorrectRecordType !== recordType) {
      return res.status(400).json({
        message:
          "Please select the correct record type, If you are trying with IPV6 (AAA record) it will come soon.",
      });
    }

    let domainUser = await DomainLimit.findOne({ userId: userRef });

    if (!domainUser) {
      domainUser = await DomainLimit.create({
        userId: userRef,
        domainCount: 0,
        domainLimit: 3,
      });
    }

    if (domainUser.domainLimit <= domainUser.domainCount) {
      return res.status(400).json({
        message:
          "You encountered your free domain limit, Please buy your next domain at just 19 ruppee.",
      });
    }

    const dns = await DNS.create({
      dnsName,
      publicIp,
      recordType,
      userRef,
    });

    if (dns) {
      const isDone = await sendBindJob("add-domain", {
        dnsName: dnsName,
        publicIp: publicIp,
        recordType: recordType,
      });
      if (isDone) {
        await DomainLimit.updateOne(
          { userId: userRef },
          { $inc: { domainCount: 1 } }
        );
      } else {
        await DNS.deleteOne({ dnsName: dns.dnsName });
        return res.status(500).json({
          message: "Failed to update DNS records. Please try again.",
        });
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

async function handleDeleteDomainName(req, res) {
  try {
    const { dnsName, _id } = req.body;
    const dns = await DNS.findOne({ dnsName: dnsName });
    if (!dns) {
      return res.status(404).json({ message: "Domain Name Not Found" });
    }
    if (!dns.userRef.equals(_id)) {
      return res.status(403).json({ message: "User Verification Failed" });
    }
    const isDone = await sendBindJob("delete-domain", {
      dnsName: dnsName,
      recordType: dns.recordType,
    });
    if (isDone) {
      await DNS.deleteOne({ dnsName: dns.dnsName });
      await DomainLimit.updateOne(
        { userId: _id },
        { $inc : { domainCount: -1 } }
      );
    } else {
      //maybe alert it is done or not
      return;
    }

    return res.status(200).json({ message: "Successfully Removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: " Something went wrong" });
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

async function handleUpdateDomainName(req, res) {
  try {
    const { dnsName, recordType, publicIp, userRef } = req.body;
    const dns = await DNS.findOne({ dnsName: dnsName });
    if (!dns) {
      return res.status(404).json({ message: "Domain Name not Found" });
    }
    if (!dns.userRef.equals(userRef)) {
      return res.status(403).json({ message: "User Verification Failed" });
    }
    const isCorrectRecordType = guessRecordType(publicIp);
    if (isCorrectRecordType !== recordType) {
      return res.status(400).json({
        message:
          "Please select the correct record type, If you are trying with IPV6 (AAA record) it will come soon.",
      });
    }
    const isDone = await sendBindJob("update-domain", {
      dnsName: dnsName,
      publicIp: publicIp,
      recordType: recordType,
      oldRecordType: dns.recordType,
    });
    if (isDone) {
      dns.publicIp = publicIp;
      dns.recordType = recordType;
      await dns.save();
      return res.status(200).json({ message: "Domain Updated" });
    } else {
      return res.status(400).json({ message: "Domain name not Updated" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export {
  handleCreateDomainName,
  handleCheckAvailability,
  handleGetUserDomains,
  handleDeleteDomainName,
  handleUpdateDomainName,
};
