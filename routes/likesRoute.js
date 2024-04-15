import express from 'express';
import validateUser from '../middleware/validateUser.js';
import fieldValidator from '../middleware/fieldValidator.js';
import { like_dislike_comment_handler, like_dislike_post_handler, likedPostOrComment } from '../controllers/likeContollers.js';


const router = express.Router();

// like a post or comment
//action= "like" or "unlike"

router.post("/post/:postId", fieldValidator(['action', 'like_on']), validateUser, like_dislike_post_handler);

router.post("/comment/:commentId", fieldValidator(['action']), validateUser, like_dislike_comment_handler);

router.get("/postorcomment/:postOrCommentId", likedPostOrComment);

// router.get("/comment/:commentId", likedComment);


export default router;
