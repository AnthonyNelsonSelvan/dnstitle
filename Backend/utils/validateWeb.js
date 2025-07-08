import axios from "axios";
import redis from "../connection/redisClient.js";
import isLocalhostIp from "is-localhost-ip";
import checkIpAbuse from "../services/abuseIp.services.js";
import dns from "node:dns/promises";
import { cooldownVerify } from "./cooldown.js";
import { IncWarnTimes } from "../model/dns.limit.helper.js";

async function validateWebsite(req, res) {
  const { rawUrl, id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Login First." });
  }

  const cooldown = await cooldownVerify(id);

  if (!cooldown) {
    return res
      .status(400)
      .json({ message: "Too many request, Please try again later." });
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
    const isAbuseIp = await checkWithProtocol("http", url, veriyKey, ipToCheck);
    if (isAbuseIp) {
      const response = await IncWarnTimes(id);
      if (!response.result) {
        return res
          .status(400)
          .json({ message: "Your Account has been Permanently Banned" });
      }
      const remaining = response.data.warnedLimit - response.data.warnedTimes;

      return res.status(400).json({
        message: `We Found your URL malicious. If you try this activity ${remaining} more time${
          remaining === 1 ? "" : "s"
        }, we will ban you permanently.`,
      });
    }
    return res.status(200).json({
      message: "You can create website with our domain name. Congrats!",
    });
  } catch {
    try {
      const isAbuseIp = await checkWithProtocol(
        "https",
        url,
        veriyKey,
        ipToCheck
      );
      if (isAbuseIp) {
        const response = await IncWarnTimes(id);
        if (!response.result) {
          return res
            .status(400)
            .json({ message: "Your Account has been Permanently Banned" });
        }
        const remaining = response.data.warnedLimit - response.data.warnedTimes;

        return res.status(400).json({
          message: `We Found your URL malicious.You have ${remaining} warning${
            remaining === 1 ? "" : "s"
          }left, we will ban you permanently.`,
        });
      }
      return res.status(200).json({
        message: "You can create website with our domain name. Congrats!",
      });
    } catch {
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
  } catch (error) {}
  const key = `ipToCheck:${ipToCheck}`;
  const cacheResult = await redis.get(key);
  if (!cacheResult) {
    const isAbuseIp = await checkIpAbuse(ipToCheck);
    await redis.set(key, isAbuseIp, "EX", 86400);
    cacheResult = isAbuseIp;
  }
  await axios.get(`${protocol}://${url}/${verifyKey}.html`, {
    timeout: 5000,
  });
  return cacheResult === "true";
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
