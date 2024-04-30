import mongoose from "mongoose";

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

const shareModel = mongoose.model("share", shareSchema)

export default shareModel;