import express from "express";
import { createUser, changePassword, getUser, changeName, loginUser } from "../controllers/userContollers.js";
import fieldValidator from "../middleware/fieldValidator.js";
import validateUser from "../middleware/validateUser.js";
import friendRequestRoute from "./friendRequestRoute.js";

const router = express.Router();

router.use("/friend-request", validateUser, friendRequestRoute)

router.post("/", fieldValidator(['firstName', 'lastName', 'email', 'password']), createUser);

router.put("/changepassword/:userId", fieldValidator(['oldPassword', 'newPassword']), validateUser, changePassword);

router.put("/changename/:userId", fieldValidator(['firstName', 'lastName']), validateUser, changeName);

router.get("/:userId", getUser);

router.post("/login", fieldValidator(['email', 'password']), loginUser);



export default router;