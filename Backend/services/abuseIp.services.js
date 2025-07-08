import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ABUSE_IPDB_API_KEY = process.env.ABUSE_IPDB_API_KEY;

async function checkIpAbuse(Ip) {
  try {
      const response = await axios.get("https://api.abuseipdb.com/api/v2/check", {
        params: {
          ipAddress: Ip,
          maxAgeInDays: 30,
        },
        headers: {
          Key: ABUSE_IPDB_API_KEY,
          Accept: "application/json",
        },
      });
      const score = response.data.abuseConfidenceScore;
    console.log(Ip);
    return 50 <= score;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error", error);
    }
  }
}

export default checkIpAbuse;
