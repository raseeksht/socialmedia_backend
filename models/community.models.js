import mongoose from "mongoose";

const communitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coverPic: {
        type: String,
        default: "https://static.zerochan.net/Arlecchino.full.4153440.webp"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    approveAnyPost: {
        type: Boolean,
        default: true
    }

})

const communityModel = mongoose.model("community", communitySchema);

export default communityModel;