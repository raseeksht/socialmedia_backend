import asyncHandler from "express-async-handler";
import { makeResponse } from "../helpers/helperFunctions.js";
import likeModel from "../models/likeModel.js";
import mongoose from "mongoose";

const like_dislike_handler = async (action, postOrCommentRef, onPostOrCommentOrShare, user) => {
    if ((action !== "like" && action !== "dislike")) {
        return {
            status: 400,
            response: makeResponse('f', "action should be like or dislike")
        }
    }
    let liked = await likeModel.findOne({ liked_by: user._id, pc_ref: postOrCommentRef })
    const model = mongoose.model(onPostOrCommentOrShare);
    if (action == "like") {
        // if already liked send liked response else like the comment or post then send response
        if (!liked) {
            const data = { liked_by: user._id, pc_ref: postOrCommentRef, like_on: onPostOrCommentOrShare }
            liked = await likeModel.create(data)


            const haude = await model.findOneAndUpdate({ _id: postOrCommentRef }, { $inc: { likes: 1 } }, { new: true })
            console.log("liked", haude)
        }
        if (liked) {
            return {
                status: 200,
                response: makeResponse("s", "Liked")
            }
        } else {
            return {
                status: 500,
                response: makeResponse("f", `failed to like this ${onPostOrCommentOrShare}`)
            }
        }
    } else {
        // dislike
        if (liked) {
            // already liked? dcrease like counter and remove record
            const haude = await model.findOneAndUpdate({ _id: postOrCommentRef }, { $inc: { likes: -1 } }, { new: true })
            let dislike = await likeModel.deleteOne({ liked_by: user._id, pc_ref: postOrCommentRef })
        }
        return {
            status: 200,
            response: makeResponse("s", "Disliked")
        }
    }

}

const like_dislike_post_handler = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const { like_on, action } = req.body;
    if (!["post", "share"].includes(like_on)) return res.json(makeResponse("f", "like_on field should be either post or share"))

    const result = await like_dislike_handler(action, postId, like_on, req.user)
    res.status(result.status).json(result.response)
})

const like_dislike_comment_handler = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const { action } = req.body;
    const result = await like_dislike_handler(action, commentId, "comment", req.user)
    res.status(result.status).json(result.response)
})

const likedPostOrComment = asyncHandler(async (req, res) => {
    const postOrCommentId = req.params.postOrCommentId;
    const likes = await likeModel.find({ pc_ref: postOrCommentId }).populate("liked_by", "firstName lastName profilePic")
    res.json(likes)

})



export { like_dislike_post_handler, like_dislike_comment_handler, likedPostOrComment };

