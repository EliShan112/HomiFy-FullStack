import { Router } from "express";
import asyncWrap from "../utils/asyncwrap.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { checkUserDetail, checkUserLogin, userLogIn, userLogOut, userSignUp } from "../controllers/userController.js";
const router = Router();

//signup
router.post("/signup", asyncWrap(userSignUp));


//login
router.post("/login", asyncWrap( userLogIn ));

router.get('/logout', userLogOut);

router.get("/check-auth", checkUserLogin);


router.get("/me", isAuthenticated, checkUserDetail);

export default router