import express from 'express';
import { communityTimeline, userTimeline } from '../controllers/timeline.controllers.js';

// /api/timeline/
const router = express.Router();

router.get("/user/:userId", userTimeline);

router.get("/community/:communityId", communityTimeline);

export default router;