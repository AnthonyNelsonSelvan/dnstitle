function setCookie(res, cookieToken) {
  console.log("cookie came here : ",cookieToken)
  try {
    res.cookie("token", cookieToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 3600000,
    });
  } catch (error) {
    console.log(error)
  }
}

function getCookie() {
  return (req, res, next) => {
    const userCookie = req.cookies.token;
    req.userToken = userCookie; // Store it in the request object
    next();
  };
}

export { setCookie, getCookie };
