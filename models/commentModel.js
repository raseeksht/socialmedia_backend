import mongoose, { mongo } from "mongoose";

const commentSchena = mongoose.Schema({
    post_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    content: String,
    parent_comment_ref: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'comment'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    },
    likes: Number
}, { timestamps: true })

const commentModel = mongoose.model("comment", commentSchena);

export default commentModel;