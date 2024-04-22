import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from "validator";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://imgs.search.brave.com/x13bsOhuhhsIiiG5GDEv0uF-9-i2z41NdXklnWKv_k4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvdXNlci1waWN0/dXJlcy8xMDAvdW5r/bm93bi01MTIucG5n",
    },
    coverPic: {
        type: String,
        default: "https://imgs.search.brave.com/x13bsOhuhhsIiiG5GDEv0uF-9-i2z41NdXklnWKv_k4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvdXNlci1waWN0/dXJlcy8xMDAvdW5r/bm93bi01MTIucG5n",
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    friendRequestSent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    friendRequestReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    totp: {
        type: String
    },
    twoFactorAuthRequired: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema);

export default userModel