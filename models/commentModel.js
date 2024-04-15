import mongoose, { mongo } from "mongoose";

const commentSchena = mongoose.Schema({
    comment_on: {
        type: String,
        emum: ["share", 'post'],
        required: true
    },
    post_ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'comment_on',
        required: true
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