import asyncHandler from "express-async-handler";
import commentModel from "../models/commentModel.js";
import { makeResponse } from "../helpers/helperFunctions.js";

export const addComment = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    // parent_comment_ref can be null for root/main comment
    const { content, parent_comment_ref } = req.body;

    const comment = commentModel.create({
        post_ref: postId,
        commentor: req.user._id,
        content,
        parent_comment_ref
    })

    if (comment) {
        res.json(makeResponse("s", "comment added", comment))
    } else {
        res.status(500).json(makeResponse("f", "failed to add comment"))
    }

})

const getGroupedCommentAndReplies = async (post_ref, parent_comment_ref = null) => {
    const result = [];
    const mainComments = await commentModel
        .find({ parent_comment_ref, post_ref })
        .populate(
            {
                path: "commentor",
                select: "firstName lastName profilePic"
            })
        .select("-post_ref")
    for (const comment of mainComments) {
        const commentObj = {
            ...comment._doc,
            subComments: []
        }
        const subComments = await getGroupedCommentAndReplies(post_ref, comment._id)
        commentObj.subComments = subComments
        result.push(commentObj)
    }
    return result;
}

export const fetchCommentForPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const result = await getGroupedCommentAndReplies(postId, null)
    res.json(result)
})

// DELETE:
export const removeComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;

    const comment = await commentModel.findOne({ _id: commentId }).populate({
        path: "post_ref",
        select: "creator",
        populate: {
            path: "creator",
            select: "_id"
        }
    })

    // delete the comment if the requsting user is creator of the comment or post creator
    if (comment.post_ref.creator._id.equals(req.user._id) || comment.commentor.equals(req.user._id)) {
        // if the comment to be deleted has replies. just empty content field and set deleted field to true
        // using this way, replies won't be effected and replies can still be visible.
        // delete whole commnet otherwise(if no replies)
        const replies = await commentModel.countDocuments({ parent_comment_ref: commentId })

        // const deleted = await commentModel.find({ _id: commentId })

        if (replies > 0) {
            comment.deleted = true // indicate deleted by commentor or post owner
            comment.content = "";
            await comment.save();
        } else {
            await comment.deleteOne();
        }

        return res.json(makeResponse("s", "Comment Deleted Succssful", comment));
    } else {
        return res.status(403).json(makeResponse('f', 'not authorized to delete'))
    }

})

export const editComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const { content } = req.body

    const comment = await commentModel.findOne({ _id: commentId })
    if (comment.commentor.equals(req.user._id)) {
        const edited = await commentModel.findOneAndUpdate({ _id: commentId }, { content: content, edited: true }, { new: true });
        if (edited) {
            res.json(makeResponse("s", "Comment Edited!!", edited))
        } else {
            res.status(500).json(makeResponse("f", "Edit Failed"));
        }
    } else {
        res.status(403).json(makeResponse("f", "Not allowed to edit others comment"))
    }
})