import userSignUputh from "@/middleware/validateUserLogin";
import { getAllUsers, googleAuth, googleOauth, signin, signup } from "../controllers/user.controller";
import { Router } from "express";
import userLoginAuth from "@/middleware/validateUserLogin";
import { IsAuth } from "@/middleware/isAuth";

const  router = Router()

router.post('/signup', userSignUputh, signup);
router.post('/signin',  userLoginAuth, signin);
router.post('/google/oauth', googleAuth)
// router.get('/auth/google/sessions', googleOauth);

router.get('/',  IsAuth, getAllUsers)


export default router;

// ya29.a0Ad52N3-D7XPwAsrqg3XCCr0HZMJ7sEz7Ma17frVjdm9wbdetYkXarc3WLRVyf84diNPvnsCz2GRExCrmSNngBd86mMn-6_4poUo9FPLngg4YxiocYtHilq5mKUrNrrb7tFm2WXHMm1sS8kCgZ8cyJUDRJP8IzK8eRZ8aCgYKASsSARASFQHGX2MiMmmSL-FpPHsKv6X5Un_HNg0170