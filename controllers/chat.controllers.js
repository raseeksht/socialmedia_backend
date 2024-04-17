import asyncHandler from "express-async-handler";
import { makeResponse } from "../helpers/helperFunctions.js";
import chatModel from "../models/chats.models.js";


const createChat = asyncHandler(async (req, res) => {
    // participants shoudl be array in stringified json
    let { isGroupChat, participants, chatName } = req.body
    try {
        participants = JSON.parse(participants);
        participants.push(req.user._id)

        if (isGroupChat && !chatName) return res.status(400).json(makeResponse("f", "chatName is required for group chat"));

        if (!isGroupChat && participants.length > 2) return res.status(400).json(makeResponse("f", "personal chat cannot contain more than 2 users"))

        if (isGroupChat && participants.length < 3) {
            console.log(participants)
            res.statusCode = 400
            throw new Error("group chat must contain at least 2 member excluding yourself")
        }

        let chat = await chatModel.create({ name: chatName, isGroupChat, participants, admin: req.user._id })
        chat = await chat.populate([{
            path: "participants",
            select: "firstName lastName profilePic"
        },
        {
            path: "admin",
            select: "firstName lastName profilePic"
        }
        ])

        if (chat) {
            res.send(makeResponse("s", "chat created", chat))
        }

    } catch (error) {
        console.log(error)
        throw new Error(error?.message ? error.message : "Unknown error occured while creating chat");
    }

})

const getMyChats = asyncHandler(async (req, res) => {
    try {
        const myChats = await chatModel.find({ participants: { $in: req.user._id } })
        res.json(myChats)

    } catch (err) {
        console.log(err?.message)
        throw new Error(error?.message ? error.message : "Unknown error occured while creating chat");
    }
})


const addOrRemoveParticipants = asyncHandler(async (req, res, action) => {
    const userId = req.params.userId;
    const chatId = req.params.chatId;

    const updateAction = action == "add" ? "$addToSet" : "$pull"

    try {
        const adduser = await chatModel.findOneAndUpdate({ _id: chatId, isGroupChat: true }, { [updateAction]: { participants: userId } }, { new: true })
        if (adduser) {
            res.json(makeResponse("s", `${action} User successfully`, adduser))
        } else {
            res.status(400).json(makeResponse("f", `Cannot ${action} user. is this personal chat?`))
        }
    } catch (err) {
        throw new Error(err?.message || `Unnknow error occured while ${action}ing user to the group`)
    }
})


export { createChat, getMyChats, addOrRemoveParticipants };