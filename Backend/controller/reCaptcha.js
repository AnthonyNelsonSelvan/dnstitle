import axios from "axios";

const verifyCaptcha = async (req, res) => {
  const { token } = req.body;

  if (!token)
    return res.status(400).json({ success: false, message: "No token provided" });

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(verifyURL, null, {
      params: {
        secret,
        response: token,
      },
    });

    const { success, score } = response.data;

    console.log("Captcha score:", score);

    if (success && score >= 0.5) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).json({ success: false, message: "Suspicious activity detected." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Captcha verification failed" });
  }
};

export default verifyCaptcha;