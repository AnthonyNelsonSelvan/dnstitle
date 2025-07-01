import axios from "axios";
import redis from "../connection/redisClient.js";
import isLocalhostIp from "is-localhost-ip";

async function validateWebsite(req, res) {
  const { rawUrl, id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Login First" });
  }

  const normalizedUrl = getNormalizedUrlOrFalse(rawUrl.trim());

  if (!normalizedUrl) {
    return res.status(400).json({
      message:
        "Invalid Url or IP format.Try removing protocol (http , https) or pathname.",
    });
  }

  if (await isLocalhostIp(normalizedUrl)) {
    return res
      .status(400)
      .json({ message: "Localhost and private ips are not allowed." });
  }

  let url = normalizedUrl;

  const veriyKey = await redis.get(`Verify:${id}`);

  try {
    await checkWithProtocol("http", url, veriyKey);
    return res.status(200).json({
      message: "You can create website with our domain name. Congrats!",
    });
  } catch {
    try {
      await checkWithProtocol("https", url, veriyKey);
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

async function checkWithProtocol(protocol, url, verifyKey) {
  await axios.get(`${protocol}://${url}`, { timeout: 5000 });
  await axios.get(`${protocol}://${url}/${verifyKey}.html`, { timeout: 5000 });
}

const getNormalizedUrlOrFalse = (input) => {
  try {
    const url = new URL(input);
    return url.hostname;
  } catch {
    try {
      const url = new URL(`http://${input}`);
      return url.host;
    } catch (error) {
      return false;
    }
  }
};

export default validateWebsite;
