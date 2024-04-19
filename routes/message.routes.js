import express from 'express';
import fieldValidator from '../middleware/fieldValidator.js';
import { sendMessage } from '../controllers/message.controllers.js';

const router = express.Router();


router.post("/send", fieldValidator(['chatId', 'content']), sendMessage);

export default router;