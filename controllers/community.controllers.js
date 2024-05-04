import asyncHandler from "express-async-handler";
import communityModel from "../models/community.models.js";
import { makeResponse } from "../helpers/helperFunctions.js";


const createCommunity = asyncHandler(async (req, res) => {
    let { name, members, coverPic, isPublic, approveAnyPost } = req.body;
    members = JSON.parse(members)
    members.push(req.user._id);
    console.log(members)
    if (members.length <= 2) {
        return res.status(400).json(makeResponse("f", "at least 2 members(excluding you) required to create community"))
    }
    console.log(members)
    const admin = req.user._id;

    try {
        const community = await communityModel.create({ name, members, coverPic, isPublic, approveAnyPost, admins: admin })
        res.json(makeResponse("s", "Community Created Successfully", community))
    } catch (err) {
        throw new Error(err.message || "failed to create community")
    }
})

export { createCommunity };