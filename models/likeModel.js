import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    liked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    like_on: {
        type: String,
        enum: ['post', 'comment', 'share'],
        required: true
    },
    pc_ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'like_on',
        required: true
    }
}, { timestamps: true });


const likeModel = mongoose.model("like", likeSchema);

export default likeModel;