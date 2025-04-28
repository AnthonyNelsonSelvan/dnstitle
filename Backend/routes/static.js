import { Router } from "express";

const router = Router();

router.get("/loginPage",(req,res) => {
    return res.render("login.ejs");
})

router.get("/signup", (req,res) => {
    return res.render("signup.ejs");
})
router.get("/create",(req,res)=>{
    return res.render("create.ejs")
})

export default router;