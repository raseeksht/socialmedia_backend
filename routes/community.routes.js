import express from 'express';
import fieldValidator from '../middleware/fieldValidator.js';
import { createCommunity } from '../controllers/community.controllers.js';
import validateUser from '../middleware/validateUser.js';

const router = express.Router();

// create a new community
router.post("/", fieldValidator(["name", "members"]), validateUser, createCommunity);

export default router;
