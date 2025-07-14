import axios from "axios";
import redis from "../connection/redisClient.js";
import isLocalhostIp from "is-localhost-ip";
import checkIpAbuse from "../services/abuseIp.services.js";
import dns from "node:dns/promises";
import { cooldownVerify } from "./cooldown.js";
import { IncWarnTimes } from "../model/dns.limit.helper.js";
import { handleIsBanned } from "../model/user.helper.js";
import { handleLogout } from "../controller/security.js";

async function validateWebsite(req, res) {
  const { rawUrl, id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Login First." });
  }

  const isBan = await handleIsBanned(id);

  if (isBan) {
    handleLogout(req,res);
    return res.status(402).json({
      message:
        "Your Account has been Permanently Banned, You would be logged out.",
    });
  }

  const cooldown = await cooldownVerify(id);

  if (!cooldown) {
    return res
      .status(400)
      .json({ message: "Too many request, Please try again later." });
  }

  const limit = await redis.get("abuseIpdb:rate_limited");
  if (limit) {
    return res.status(429).json({
      message:
        "Today's subdomain creation limit has been reached. You can start creating new subdomains again at 12:00 AM IST (UTC +5:30).",
    });
  }

  const normalizedUrl = getNormalizedUrlOrFalse(rawUrl.trim());

  if (!normalizedUrl) {
    return res.status(400).json({
      message:
        "Invalid Url or IP format.Try removing protocol (http , https) or pathname if added.",
    });
  }

  if (rawUrl.includes(":")) {
    return res
      .status(400)
      .json("Ipv6 and ports are not allowed, ':' detected.");
  }

  if (await isLocalhostIp(normalizedUrl)) {
    return res
      .status(400)
      .json({ message: "Localhost and private ips are not allowed." });
  }

  let url = normalizedUrl;

  const veriyKey = await redis.get(`Verify:${id}`);

  const isIP =
    /^(?:\d{1,3}\.){3}\d{1,3}$/.test(url) || /^[a-fA-F0-9:]+$/.test(url);
  let ipToCheck = url;
  if (!isIP) {
    try {
      const ips = await dns.resolve(url);
      ipToCheck = ips[0];
    } catch {
      return res.status(400).json({
        message: "Could not resolve domain to IP. Please check your URL.",
      });
    }
  }

  try {
    const response = await checkWithProtocol("http", url, veriyKey, ipToCheck);
    console.log(response);
    if (response.rateLimited) {
      return res.status(429).json({
        message:
          "Today's subdomain creation limit has been reached. You can start creating new subdomains again at 12:00 AM IST (UTC +5:30).",
      });
    }
    if (response.isAbuseIp) {
      const response = await IncWarnTimes(id);
      if (!response.result) {
        handleLogout(req,res);
        return res.status(402).json({
          message:
            "Your Account has been Permanently Banned, You would be logged out.",
        });
      }
      const remaining = response.data.warnedLimit - response.data.warnedTimes;

      return res.status(402).json({
        message: `We Found your URL malicious.You have ${
          remaining + 1
        } warning${
          remaining === 0 ? "" : "s"
        } left, we will ban you permanently.`,
      });
    }
    return res.status(200).json({
      message: "You can create website with our domain name. Congrats!",
    });
  } catch {
    try {
      const response = await checkWithProtocol(
        "https",
        url,
        veriyKey,
        ipToCheck
      );
      console.log(response);
      if (response.isAbuseIp) {
        const response = await IncWarnTimes(id);
        if (!response.result) {
          handleLogout(req,res);
          return res.status(402).json({
            message:
              "Your Account has been Permanently Banned, You have been logged out.",
          });
        }
        const remaining = response.data.warnedLimit - response.data.warnedTimes;

        return res.status(402).json({
          message: `We Found your URL malicious.You have ${
            remaining + 1
          } warning${
            remaining === 0 ? "" : "s"
          } left, we will ban you permanently.`,
        });
      }
      return res.status(200).json({
        message: "You can create website with our domain name. Congrats!",
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message:
          "Something went wrong. The site may be unreachable or blocking requests. Or you have not added ownership file.",
      });
    }
  }
}

async function checkWithProtocol(protocol, url, verifyKey, ipToCheck) {
  try {
    await axios.get(`${protocol}://${url}`, { timeout: 5000 });
  } catch (error) {
    // optional: log or ignore
  }

  const key = `ipToCheck:${ipToCheck}`;
  let cacheResult = await redis.get(key);
  if (cacheResult === null) {
    const isRateLimited = await redis.get("abuseIpdb:rate_limited");
    if (isRateLimited) {
      return { rateLimited: true };
    }
    const isAbuseIp = (await checkIpAbuse(ipToCheck)) ? "true" : "false";
    await redis.set(key, isAbuseIp, "EX", 86400);
    cacheResult = isAbuseIp;
  }
  //   await axios.get(`${protocol}://${url}/${verifyKey}.html`, {
  //   timeout: 5000,
  // });
  const isAbuse = cacheResult === "true";
  return {
    isAbuseIp: isAbuse,
    rateLimited: false,
  };
}

const getNormalizedUrlOrFalse = (input) => {
  try {
    const url = new URL(input);
    return url.hostname;
  } catch {
    try {
      const url = new URL(`http://${input}`);
      return url.hostname;
    } catch (error) {
      return false;
    }
  }
};

export default validateWebsite;
