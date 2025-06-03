import axios from "axios";

async function validateWebsite(req, res) {
  const rawUrl = req.query.publicIp;

  const normalizedUrl = getNormalizedUrlOrFalse(rawUrl.trim());

  if (!normalizedUrl) {
    return res.status(400).json({ message: "Invalid Url or IP format.Try removing protocol (http , https) or pathname." });
  }

  let url = normalizedUrl;

  try {
    // Try HTTP
    await axios.get(`http://${url}`, {
      timeout: 5000,
    });

    return res.status(200).json({
      message: "You can create website with our domain name. Congrats!",
    });
  } catch (httpError) {
    console.log(httpError);
    try {
      // Try HTTPS fallback
      await axios.get(`https://${url}`, {
        timeout: 5000,
      });

      return res.status(200).json({
        message: "You can create website with our domain name. Congrats!",
      });
    } catch (httpsError) {
      console.log(httpsError);
      return res.status(400).json({
        message:
          "Something went wrong. The site may be unreachable or blocking requests.",
      });
    }
  }
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
