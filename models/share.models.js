import mongoose, { mongo } from "mongoose";

const shareSchema = mongoose.Schema({
    post_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    shared_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: Number,

}, { timestamps: true })

export const shareModel = mongoose.model("share", shareSchema)