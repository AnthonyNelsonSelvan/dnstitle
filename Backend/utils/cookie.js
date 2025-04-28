function setCookie(res, cookieToken) {
  res.cookie("token", cookieToken, {
    httpOnly: true, // Prevents client-side access
    secure: false,  // Set to true in production with HTTPS
    sameSite: "Strict",
    maxAge: 3600000, // 1 hour
  });
}

function getCookie() {
  return (req, res, next) => {
    const userCookie = req.cookies.token; // Correct way to get cookies
    req.userToken = userCookie; // Store it in the request object
    next();
  };
}

export { setCookie, getCookie };
