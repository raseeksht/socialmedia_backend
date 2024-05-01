import asyncHandler from 'express-async-handler';
import { makeResponse } from '../helpers/helperFunctions.js';
import postModel from '../models/post.models.js';

const createPost = asyncHandler(async (req, res) => {
    // postedOn can be either user, community or page
    // postedOnId is the reference to user community or page
    // if postedOn == user, postedOnId is not required 
    // TOdo: complete this function
    const { content, picUrl, postedOn, postedOnId } = req.body;
    if (!(content || picUrl)) {
        return res.status(400).json(makeResponse("f", "content or picUrl required to create post"));
    }
    if (!postedOn) {
        return res.status(400).json(makeResponse("f", "postedOn required"))
    }
    if (!['user', 'community', 'page'].includes(postedOn)) {
        return res.status(400).json(makeResponse("f", "invalid postedOn value, valid values = (user, community or page)"))
    }

    const data = { creator: req.user._id, content, picUrl, postedOn }
    const post = await postModel.create(data)

    const aaa = await post.populate([
        {
            path: "creator",
            select: "firstName lastName email profilePic"
        }
    ])

    res.json(makeResponse("s", "post Created", aaa))

})


const fetchPosts = asyncHandler(async (req, res) => {
    const posts = await postModel.find().populate({
        path: "creator",
        select: "firstName lastName email profilePic"
    })
    res.json(posts)
})

const editPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const { content, picUrl } = req.body
    if (!(content || picUrl)) {
        return res.status(400).json(makeResponse("f", "content or picUrl required to edit post"));
    }

    const updateQuery = {
        content: content || undefined,
        picUrl: picUrl || undefined,
        edited: true
    }
    const post = await postModel.findOneAndUpdate({ _id: postId, creator: req.user._id }, updateQuery, { new: true }).populate({
        path: "creator",
        select: "firstName lastName profilePic"
    })
    if (!post) {
        return res.status(401).json(makeResponse("f", "Invalid Modification. Not your post to edit"))
    }
    res.json(makeResponse("s", "post updated", post))
})

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    const post = await postModel.findOneAndDelete({ _id: postId, creator: req.user._id })
    if (post) {
        res.json(makeResponse("s", "Selected Post deleted successfully", post))
    } else {
        // either post doesn't exists for the requesting person is not creator
        res.status(401).json(makeResponse("f", "Invalid postId OR Not Authorized to delete post"))
    }

})

export { createPost, fetchPosts, editPost, deletePost };