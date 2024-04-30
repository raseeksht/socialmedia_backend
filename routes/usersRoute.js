import express from "express";
import {
    createUser,
    changePassword,
    getUser,
    changeName,
    loginUser,
    afterLoginVerify2fa
} from "../controllers/user.controllers.js";
import fieldValidator from "../middleware/fieldValidator.js";
import validateUser from "../middleware/validateUser.js";
import friendRequestRoute from "./friendRequestRoute.js";
import twoFARoute from './2fa.routes.js';

const router = express.Router();

router.use("/friend-request", validateUser, friendRequestRoute)

router.use("/2fa", validateUser, twoFARoute);

router.post("/", fieldValidator(['firstName', 'lastName', 'email', 'password']), createUser);

router.put("/changepassword/", fieldValidator(['oldPassword', 'newPassword']), validateUser, changePassword);

router.put("/changename/", fieldValidator(['firstName', 'lastName']), validateUser, changeName);

router.post("/login", fieldValidator(['email', 'password']), loginUser);

router.post("/login/verify2fa", fieldValidator(['otp']), afterLoginVerify2fa);

router.get("/:userId", getUser);





export default router;