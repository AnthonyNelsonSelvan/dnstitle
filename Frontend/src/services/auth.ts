import axios from "axios";

const checkCookie = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/security/token-verify",
      { withCredentials: true, headers: { "Cache-Control": "no-store" } }
    );
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
  const logout = await axios.post(
    "http://localhost:3000/security/logout",
    {},
    {
      withCredentials: true,
    }
  );
  if (!logout) {
    return false;
  }
  return true;
};

export { checkCookie, deleteCookie };
