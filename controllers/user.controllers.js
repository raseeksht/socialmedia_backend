import asyncHandler from "express-async-handler";
import userModel from "../models/user.models.js";
import { decodeAuthHeaderToken, generateJwt, makeResponse, verifyOtp } from "../helpers/helperFunctions.js";

const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, profilePic, coverPic } = req.body;

    const usrCount = await userModel.countDocuments({ email })
    if (usrCount > 0) {
        return res.status(400).json(makeResponse("s", "email already registered"))
    }
    try {
        const result = await userModel.create({
            firstName, lastName, email, password, profilePic, coverPic
        })

        const result1 = await userModel.findOne({ _id: result._id }).select("-password")

        res.json(result1)

    } catch (err) {
        console.log("error occured", err)
        return res.status(500).json({ err })
    }


})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json(makeResponse("f", "oldPassword and newPassword Required"))
    if (oldPassword == newPassword) return res.status(400).json(makeResponse("f", "old and new password cannot be same"))

    const user = await userModel.findOne({ _id: req.user._id })
    if (await user.matchPassword(oldPassword)) {
        user.password = newPassword
        user.save()
        return res.json(makeResponse("s", "Password Changed!"))
    } else {
        res.status(401).json(makeResponse("f", "old password invalid"));
    }
})

const changeName = asyncHandler(async (req, res) => {
    const { firstName, lastName } = req.body

    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { firstName, lastName })
    if (user) {
        return res.json(makeResponse("s", "Name Change Successful"))
    } else {
        res.status(400).json(makeResponse("f", "Name update failed"))
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (user && await user.matchPassword(password)) {
        let tokenPayload;
        let message;
        if (user.twoFactorAuthRequired) {
            tokenPayload = { _id: user._id, twoFactorAuthRequired: true, twoFactorAuthVerified: false };
            message = "Enter OTP to continue login";
        } else {
            tokenPayload = { _id: user._id, twoFactorAuthRequired: false }
            message = "Login Success"
        }
        const token = await generateJwt(tokenPayload)
        res.json({ status: "ok", message, token })
    } else {
        res.status(401).json(makeResponse("f", "username or password invalid"))
    }
})

const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId

    try {
        const user = await userModel.findOne({ _id: userId })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json(makeResponse("f", "Error fetching user"))
    }
})

const afterLoginVerify2fa = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    try {
        const decoded = decodeAuthHeaderToken(req);
        if (decoded.error) {
            return res.status(403).json(makeResponse("f", decoded.error))
        }
        const user = await userModel.findOne({ _id: decoded._id })

        if (verifyOtp(otp, await user.totp)) {
            const token = await generateJwt({ _id: user._id, twoFactorAuthRequired: true, twoFactorAuthVerified: true })
            res.json({ status: "ok", message: "Valid Otp", token })
        } else {
            res.status(403).json(makeResponse("f", "Invalid Otp"))
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})



export {
    createUser,
    changePassword,
    getUser,
    changeName,
    loginUser,
    afterLoginVerify2fa,
}
