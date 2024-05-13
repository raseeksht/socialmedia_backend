import mongoose from "mongoose";

const pageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    profilePic: {
        type: String,
        default: `https://api.multiavatar.com/page${Math.floor(Math.random() * 1000)}.png`
    },
    coverPic: {
        type: String,
        default: `https://picsum.photos/seed/${Math.random()}/1024/386`
    },
    description: {
        type: String
    }
}, { timestamps: true });

const pageModel = mongoose.model("page", pageSchema);


export default pageModel;