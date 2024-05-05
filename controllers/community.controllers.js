import asyncHandler from "express-async-handler";
import communityModel from "../models/community.models.js";
import { makeResponse } from "../helpers/helperFunctions.js";


const createCommunity = asyncHandler(async (req, res) => {
    let { name, members, coverPic, isPublic, approveAnyPost } = req.body;
    try {
        members = JSON.parse(members)
        if (!(members instanceof Array)) return res.status(400).json(makeResponse("s", "members should be of type array"))
        members.push(req.user._id);

        if (members.length <= 2) {
            return res.status(400).json(makeResponse("f", "at least 2 members(excluding you) required to create community"))
        }
        const admin = req.user._id;
        const community = await communityModel.create({ name, members, coverPic, isPublic, approveAnyPost, admins: admin })
        res.json(makeResponse("s", "Community Created Successfully", community))
    } catch (err) {
        throw new Error(err.message || "failed to create community");
    }
})

const addOrRemoveUserToCommunity = async (req, res, action) => {
    let { members, communityId } = req.body;
    let updateQuery;
    try {
        members = JSON.parse(members)
        if (action == "add") {
            // console.log("we ")
            updateQuery = { $addToSet: { members } }
        } else {
            // action "remove"
            if (members.length > 1) return res.status(400).json(makeResponse("f", "remove only one user at a time"));
            updateQuery = { $pull: { members: members[0] } }
        }
        // adds the members to community, if member already in community they will not get added
        const update = await communityModel.findOneAndUpdate({ _id: communityId }, updateQuery, { new: true })
        res.json(makeResponse('s', `Members ${action == "add" ? "added" : "removed"}`, update))
    } catch (err) {
        throw new Error(err.message || "Failed while adding user")
    }
}

export { createCommunity, addOrRemoveUserToCommunity };