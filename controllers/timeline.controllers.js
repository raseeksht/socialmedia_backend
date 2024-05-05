import asyncHandler from 'express-async-handler';
import postModel from '../models/post.models.js';
import shareModel from '../models/share.models.js';
import { makeResponse } from '../helpers/helperFunctions.js';


const getTimelineResult = asyncHandler(async (req, res, id, fetchType = "user") => {
    // timeline fetchType can be user, community or page
    const postFilter = {};
    switch (fetchType) {
        case "user":
            postFilter.creator = id;
            break;
        case "community":
            postFilter.postedOnRef = id;
            break;
        case "page":
            postFilter.postedOnRef = id;
            break;
        default:
            throw new Error(`Invalid Value for fetchType : '${fetchType}'`)
            break;
    }

    const shareFilter = { shared_on_ref: id, shared_on: fetchType };

    postFilter.postedOn = fetchType;

    console.log(shareFilter, postFilter)

    try {
        const posts = await postModel.find(postFilter).populate("creator", "firstName lastName profilePic");
        const shares = await shareModel.find(shareFilter).populate({
            path: "post_ref",
            populate: {
                path: "creator",
                select: "firstName lastName profilePic"
            }
        });
        const timeline = [...posts, ...shares].sort((p1, p2) => p2.createdAt - p1.createdAt)
        res.json(makeResponse(
            "s",
            `${fetchType.replace(/^\w/, (c) => c.toUpperCase())} timeline fetched successfully`, // dynamic captialize first letter
            timeline
        ));
    } catch (err) {
        throw new Error(err.message || "some error getting timeline")
    }

});

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
    communityTimeline,
    getTimelineResult
}