import express from "express";
import fieldValidator from "../middleware/fieldValidator.js";
import { createChat, getMyChats, addOrRemoveParticipants } from "../controllers/chat.controllers.js"

const router = express.Router()

router.post("/", fieldValidator(['participants']), createChat);

// get chat that requester is present
router.get("/", getMyChats)

router.post("/add/:chatId/:userId", (req, res) => {
    const action = "add";
    addOrRemoveParticipants(req, res, action)
});

router.post("/remove/:chatId/:userId", (req, res) => {
    const action = "remove";
    addOrRemoveParticipants(req, res, action)
});

// router.post("/leavegroup", leaveGroup);

// router.post("/makeadmin/:userId", makeAdmin);

export default router;

