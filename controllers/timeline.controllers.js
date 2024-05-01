import asyncHandler from 'express-async-handler';
import postModel from '../models/post.models.js';
import shareModel from '../models/share.models.js';
import { makeResponse } from '../helpers/helperFunctions.js';

const userTimeline = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // fetch all the post made or shared by userId

    try {
        const userPosts = await postModel.find({ creator: userId, postedOn: "user" }).populate("creator", "firstName lastName profilePic");
        const userShares = await shareModel.find({ shared_by: userId, shared_on: "user" }).populate({
            path: "post_ref",
            populate: {
                path: "creator",
                select: "firstName lastName profilePic"
            }
        });
        const timeline = [...userPosts, ...userShares].sort((p1, p2) => p2.createdAt - p1.createdAt)
        res.json(makeResponse("s", "timeline fetched successfully", timeline));
    } catch (err) {
        throw new Error(err.message || "some error getting timeline")
    }

})


const communityTimeline = asyncHandler(async (req, res) => {
    const communityId = req.params.communityId;

    try {
        const communityPosts = await postModel.find({ postedOn: "community", postedOnRef: communityId })
            .populate("creator", "firstName lastName profilePic");
        const communityShare = await shareModel.find({ shared_on: "community", shared_on_ref: communityId })
            .populate([
                {
                    path: "post_ref",
                    populate: {
                        path: "creator",
                        select: "firstName lastName profilePic"
                    }
                }
            ]);
        const timeline = [...userPosts, ...userShares].sort((p1, p2) => p2.createdAt - p1.createdAt)

        res.json(makeResponse("s", "timeline fetched successfully", timeline));

    } catch (err) {

    }
})

// TODO : combine communityTimeline and userTimeline with conditional filtering
// TODO : also support page Timeline

export {
    userTimeline,
    communityTimeline
}