import {Router} from "express";
import passport from "../config/passport.js";
import User from "../model/user.js";
import { handleSignToken } from "../utils/jwt.js";
import { setCookie } from "../utils/cookie.js";

const router = Router();

router.get("/google", passport.authenticate("google", {scope: ["email", "profile"]}));

router.get("/google/callback", passport.authenticate("google", { session : false, failureRedirect : "/login"}),
async(req,res) => {
    try {
        let user = await User.findOne({email : req?.user?.email});
        const Cookie = await handleSignToken(user)
        setCookie(res,Cookie)
        res.redirect("/")
    } catch (error) {
        console.log("oauth Cookie error : ",error);
    }
})

export default router;
