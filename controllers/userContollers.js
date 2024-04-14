import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import { generateJwt, makeResponse } from "../helpers/helperFunctions.js";

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
    const userId = req.params.userId
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json(makeResponse("f", "oldPassword and newPassword Required"))
    if (oldPassword == newPassword) return res.status(400).json(makeResponse("f", "old and new password cannot be same"))

    const user = await userModel.findOne({ _id: userId })
    if (await user.matchPassword(oldPassword)) {
        user.password = newPassword
        user.save()
        return res.json(makeResponse("s", "Password Changed!"))
    } else {
        res.status(401).json(makeResponse("f", "old password invalid"));
    }
})

const changeName = asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const { firstName, lastName } = req.body

    const user = await userModel.findOneAndUpdate({ _id: userId }, { firstName, lastName })
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
        const token = await generateJwt({ _id: user._id })
        res.json({ status: "ok", message: "Login Success", token })
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

export { createUser, changePassword, getUser, changeName, loginUser }