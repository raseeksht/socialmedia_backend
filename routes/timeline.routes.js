import express from 'express';
import { getTimelineResult } from '../controllers/timeline.controllers.js';

// /api/timeline/
const router = express.Router();

router.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId
    console.log(userId)
    getTimelineResult(req, res, userId, "user");
});

router.get("/community/:communityId", async (req, res) => {
    const communityId = req.params.communityId;
    console.log("community is here", communityId);
    getTimelineResult(req, res, communityId, "community");
});

export default router;