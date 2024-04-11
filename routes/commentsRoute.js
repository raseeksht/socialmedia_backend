import express from 'express';
import validateUser from '../middleware/validateUser.js';
import { addComment, editComment, fetchCommentForPost, removeComment } from '../controllers/commentControllers.js';
import fieldValidator from '../middleware/fieldValidator.js';

const router = express.Router();

// add comment to post
router.post("/:postId", validateUser, fieldValidator(['content']), addComment);

// fetch comments for specific post
router.get("/:postId", fetchCommentForPost);


// delete comment
router.delete("/:commentId", validateUser, removeComment)

// edit commnet
router.put("/:commentId", validateUser, editComment);


export default router;