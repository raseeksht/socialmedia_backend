import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import { makeResponse } from "../helpers/helperFunctions.js";

const acceptFriendRequest = async (requestor, acceptor) => {
    const accept = await userModel.findOneAndUpdate({ _id: requestor }, { $addToSet: { friends: acceptor }, $pull: { friendRequestSent: acceptor } });

    const accept2 = await userModel.findOneAndUpdate({ _id: acceptor }, { $addToSet: { friends: requestor }, $pull: { friendRequestReceived: requestor } })

    if (accept && accept2) {
        return true
    } else {
        // console.log(accept, accept2)
        return false
    }
}

const declineFriendRequest = async (requestor, decliner) => {
    const updateQuery = {
        $pull: { friendRequestReceived: requestor, friendRequestSent: decliner },
    }
    const decline = await userModel.updateMany({ _id: { $in: [requestor, decliner] } }, updateQuery)
    console.log(decline)
    return decline ? true : false;
}

const sendFriendRequest = asyncHandler(async (req, res) => {
    const friendId = req.params.friendId;

    try {
        const user = await userModel.findOne({ _id: req.user._id, $or: [{ friendRequestSent: { $in: [friendId] } }, { friends: { $in: [friendId] } }, { friendRequestReceived: { $in: [friendId] } }] });

        if (user) {
            let response;
            if (user.friends.includes(friendId)) response = "Already Friend";
            else if (user.friendRequestReceived.includes(friendId)) {
                if (await acceptFriendRequest(friendId, req.user._id)) {
                    response = "Friend Request already Received so not it will be accepted";
                } else {
                    response = "friennd request already received but adding friend failed";
                }
            }
            else response = "Already Sent";
            // console.log(user)
            return res.status(400).json(makeResponse("f", response))
        }



        // add user to receiver friendRequestReceived list
        await userModel.findOneAndUpdate({ _id: friendId }, { $addToSet: { friendRequestReceived: req.user._id } })

        // add the friend to users friendRequestSent list
        await userModel.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { friendRequestSent: friendId } });

        res.json(makeResponse("s", "Friend Request sent"));

    } catch (err) {
        console.log(err)
        res.status(500).json(makeResponse("f", "Failed to send request", err));

    }
})

const getSentRequest = asyncHandler(async (req, res) => {
    const requestSent = await userModel.findById(req.user._id).select("friendRequestSent").populate({
        path: "friendRequestSent",
        select: "firstName lastName profilePic"
    });
    res.json(makeResponse("s", "Sent List fetched", requestSent.friendRequestSent))
})

const getReceivedRequest = asyncHandler(async (req, res) => {
    const requestReceived = await userModel.findById(req.user._id).select("friendRequestReceived").populate({
        path: "friendRequestReceived",
        select: "firstName lastName profilePic"
    });
    res.json(makeResponse("s", "Sent List fetched", requestReceived.friendRequestReceived))
})

const handleAcceptFriendRequest = asyncHandler(async (req, res) => {
    const friendId = req.params.friendId

    // check if the friendId is in friendRequestReceived only then proceed forward
    const gotRequest = await userModel.exists({ _id: req.user._id, friendRequestReceived: { $in: friendId } });
    if (!gotRequest) return res.status(400).json(makeResponse("f", "can accept cause you havent received friend request from that user"));


    const accept = await acceptFriendRequest(friendId, req.user._id)
    if (accept) {
        res.json(makeResponse("s", "Friend request accepted"));
    } else {
        res.status(500).json(makeResponse("f", "Error while accepting request"));
    }
})

const handleDeclineFriendRequest = asyncHandler(async (req, res) => {
    const friendId = req.params.friendId;
    const decline = await declineFriendRequest(friendId, req.user._id);
    if (decline) {
        res.json(makeResponse("s", "Friend request rejected"))
    } else {
        res.status(500).json(makeResponse("f", "error rejecting request"))
    }

})

const handleUnFriend = asyncHandler(async (req, res) => {
    const friendId = req.params.friendId;
    // remove only if already friends
    const isFriend = await userModel.exists({ _id: req.user._id, friends: { $in: friendId } });
    if (!isFriend) return res.status(400).json(makeResponse("f", "cant unfriend you guys are already strangers"));

    // remove from the user friend list
    const unfriend = await userModel.findOneAndUpdate({ _id: req.user._id }, { $pull: { friends: friendId } })

    // remove from the friendId list
    const unfriend1 = await userModel.findOneAndUpdate({ _id: friendId }, { $pull: { friends: req.user._id } })

    if (unfriend && unfriend1) {
        res.json(makeResponse("s", "Removed from your friend circle"));
    } else {
        res.json(makeResponse("f", "unfriending error..."))
    }
})


const myFriendList = asyncHandler(async (req, res) => {
    const friends = await userModel.findOne({ _id: req.user._id }).select("friends").populate("friends", "firstName lastName profilePic")
    res.json(makeResponse("s", "Your Friend list!", friends.friends))
})

const mutualFriends = asyncHandler(async (req, res) => {
    const friendId = req.params.friendId;
    const meroFriendList = await userModel.findOne({ _id: req.user._id }, { friends: 1 });
    const sathikoFriendList = await userModel.findOne({ _id: friendId }, { friends: 1 });

    let mutual = meroFriendList.friends.filter(friend => sathikoFriendList.friends.includes(friend));
    mutual = await userModel.find({ _id: { $in: mutual } }, { firstName: 1, lastName: 1, profilePic: 1 })
    res.json(makeResponse("s", "mutual friend list", mutual))
})

export {
    sendFriendRequest,
    getSentRequest,
    getReceivedRequest,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleUnFriend,
    myFriendList,
    mutualFriends
};