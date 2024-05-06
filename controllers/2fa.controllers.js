import asyncHandler from "express-async-handler";
import { TOTP } from "totp-generator";
import { generateJwt, makeResponse, verifyOtp } from "../helpers/helperFunctions.js";
import userModel from "../models/user.models.js";
import jwt from 'jsonwebtoken';



const getQR = asyncHandler(async (req, res) => {
    // generate random string
    const alnum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; // base32 alphabets
    let secret = "";
    for (let i = 0; i < 16; i++) {
        const pos = Math.floor(Math.random() * alnum.length)
        // console.log(pos)
        secret += alnum[pos]
    }
    const user = await userModel.findOne({ _id: req.user._id })
    const uri = encodeURIComponent(`otpauth://totp/SocialMedia:${user.firstName}?secret=${secret}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${uri}`;
    const payload = {
        qr: qrUrl,
        secretToken: await generateJwt({ totp: secret }),
        devMsg: "send secretToken back to server when turning on the 2fa or changing 2fa"
    }
    res.json(makeResponse("s", "scan qr", payload))
})

const set2fa = asyncHandler(async (req, res) => {
    const { otp, secretToken } = req.body;
    try {
        let user = await userModel.findOne({ _id: req.user._id })
        const { totp } = jwt.verify(secretToken, process.env.JWT_SECRET)

        if (verifyOtp(otp, totp)) {
            user.totp = totp;
            user.twoFactorAuthRequired = true
            user = await user.save();
            res.json({ status: "ok", message: "2FA Enabled!!", token: await generateJwt({ _id: req.user._id, twoFactorAuthRequired: true, twoFactorAuthVerified: true }) })
        } else {
            res.status(403).json(makeResponse("f", "Invalid OTP"))
        }
    } catch (err) {
        throw new Error(err?.message || "Unknown error while setting 2fa")
    }
})

const remove2fa = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await userModel.findOne({ _id: req.user._id });
        if (!user.twoFactorAuthRequired) return res.status(400).json(makeResponse("f", "2fa is not enabled so why remove it?"))

        if (verifyOtp(otp, user.totp)) {
            user.twoFactorAuthRequired = false;
            user.totp = "";
            if (await user.save()) {
                res.json(makeResponse("s", "2FA disabled!!"))
            }
            else {
                throw new Error("Error removing 2fa")
            }
        } else {
            res.status(403).json(makeResponse("f", "Invalid OTP"))
        }
    } catch (err) {
        throw new Error(err?.message || "Unknown error while remove 2fa");
    }
})

export { getQR, set2fa, remove2fa };