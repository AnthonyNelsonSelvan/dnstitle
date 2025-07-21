import axios from "axios";
import { apiUrl } from "../config";

const checkCookie = async () => {
  try {
    const response = await axios.get(`${apiUrl}/security/token-verify`, {
      withCredentials: true,
      headers: { "Cache-Control": "no-store" },
    });
    if (response.status === 200 && response.data.user) {
      return response.data.user; // ✅ Returns user data
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
const deleteCookie = async () => {
  try {
    await axios.post(
      `${apiUrl}/security/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { checkCookie, deleteCookie };
