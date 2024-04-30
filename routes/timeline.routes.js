import express from 'express';
import { userTimeline } from '../controllers/timeline.controllers.js';

// /api/timeline/
const router = express.Router();

router.get("/user/:userId", userTimeline);

export default router;