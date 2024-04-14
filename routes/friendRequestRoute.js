import express from 'express';
import {
    sendFriendRequest,
    getSentRequest,
    getReceivedRequest,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleUnFriend,
    myFriendList,
    mutualFriends
} from "../controllers/friendControllers.js";



const router = express.Router();

// /api/users/friend-request

router.post("/:friendId", sendFriendRequest);

router.get("/sent", getSentRequest);
router.get("/received", getReceivedRequest);

router.post("/accept/:friendId", handleAcceptFriendRequest);
router.post("/reject/:friendId", handleDeclineFriendRequest);

router.post('/unfriend/:friendId', handleUnFriend);

router.get("/myfriendlist", myFriendList);

router.get("/mutualfriends/:friendId", mutualFriends);

export default router;