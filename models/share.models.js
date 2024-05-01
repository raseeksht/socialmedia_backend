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
    shared_on: {
        type: String,
        enum: ['user', 'community', 'page'],
        required: true
    },
    shared_on_ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "shared_on",
        required: true
    },
    likes: Number,

}, { timestamps: true })

const shareModel = mongoose.model("share", shareSchema)

export default shareModel;