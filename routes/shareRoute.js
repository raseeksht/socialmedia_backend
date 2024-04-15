import express from 'express';
import { getSharedPost, sharePost, deleteSharedPost } from '../controllers/shareControllers.js';

const router = express.Router();

// share the post
router.post("/:postId", sharePost);

// get the sharedPost
router.get("/:sharedPostId", getSharedPost);

// delete the sharedpost
router.delete("/:sharedPostId", deleteSharedPost)


export default router;