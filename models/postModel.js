import mongoose, { mongo } from "mongoose";
import commentModel from "./commentModel.js";

const postSchema = mongoose.Schema({
    // string content of a post
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
    },
    // for picture content of post
    picUrl: {
        type: String,
    },
    edited: Boolean,
    likes: Number,
    shares: Number

}, { timestamps: true });

// delete all comments if the post is deleted
postSchema.pre('findOneAndDelete', async function (next) {
    // Access the post being removed using `this`
    const _id = this.getQuery()._id;
    await commentModel.deleteMany({ post_ref: _id })
    next();
});

const postModel = mongoose.model("post", postSchema);


export default postModel;