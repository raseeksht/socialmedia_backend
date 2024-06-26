import asyncHandler from "express-async-handler";
import shareModel from "../models/share.models.js";
import { makeResponse } from "../helpers/helperFunctions.js";


const sharePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const { sharedOn } = req.body;
    if (!sharedOn) return res.status(400).json(makeResponse("f", "sharedOn field required"))
    if (!['user', 'community', 'page'].includes(sharedOn)) return res.status(400).json(makeResponse("f", "invalid value for sharedOn"))

    try {
        let share = await shareModel.create({ post_ref: postId, shared_by: req.user._id, likes: 0, shared_on: sharedOn })
        share = await share.populate([
            {
                path: "post_ref",
                populate: {
                    path: "creator",
                    select: "firstName lastName profilePic"
                }
            },
            {
                path: "shared_by",
                select: "firstName lastName profilePic"
            }
        ])
        if (share) {
            res.json(makeResponse("s", "Post Shared to your timeline", share))
        } else {
            res.status(500).json(makeResponse("f", "failed to share"))
        }
    } catch (error) {
        console.log(error)
        throw new Error(error.message)
        res.status(500).json(makeResponse("f", "failed to share"))
    }

})

const getSharedPost = asyncHandler(async (req, res) => {
    const sharedPostId = req.params.sharedPostId;
    const share = await shareModel.findOne({ _id: sharedPostId }).populate([
        {
            path: "post_ref",
            populate: {
                path: "creator",
                select: "firstName lastName profilePic"
            }
        }, {
            path: "shared_by",
            select: "firstName lastName profilePic"
        }
    ])
    res.json(makeResponse("s", "shared post is here", share))

})

const deleteSharedPost = asyncHandler(async (req, res) => {
    const sharedPostId = req.params.sharedPostId;
    const deletedSharedPost = await shareModel.deleteOne({ _id: sharedPostId })

    if (deletedSharedPost) {
        res.json(makeResponse("s", "deleted", deletedSharedPost))
    } else {
        res.status(500).json(makeResponse("f", "failed to delted"))
    }
})

export { getSharedPost, sharePost, deleteSharedPost };