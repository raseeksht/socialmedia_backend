import express from 'express';
import fieldValidator from '../middleware/fieldValidator.js';
import { sendMessage, fetchMessages } from '../controllers/message.controllers.js';

const router = express.Router();


router.post("/send", fieldValidator(['chatId', 'content']), sendMessage);

router.get("/fetchmessages/:chatId", fetchMessages);

export default router;