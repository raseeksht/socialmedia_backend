import mongoose, { mongo } from "mongoose";

const chatSchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message"
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const chatModel = mongoose.model("chat", chatSchema)

export default chatModel;