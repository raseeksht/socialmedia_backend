import mongoose, { mongo } from "mongoose";

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    content: {
        type: String
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    }
}, {
    timestamps: true
});

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;

