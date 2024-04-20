import asyncHandler from "express-async-handler"
import chatModel from "../models/chats.models.js";
import { makeResponse } from "../helpers/helperFunctions.js";
import messageModel from "../models/message.models.js";


const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content } = req.body;
    try {
        const isChatAvailable = await chatModel.findOne({ _id: chatId, participants: { $in: req.user._id } })
        if (!isChatAvailable) {
            // res.statusCode = 403
            return res.status(403).json(makeResponse("f", "you are not the part of this group"))
        }
        const newMessage = await messageModel.create({
            sender: req.user._id,
            content,
            chat: chatId
        })

        isChatAvailable.lastMessage = newMessage._id;
        const saved = await isChatAvailable.save()
        if (saved) {
            res.json(makeResponse("s", "message sent", newMessage))
        } else {
            res.status(500).json(makeResponse("f", "failed to send message"))
        }
    } catch (err) {
        console.log(err?.message || "unknown err")
        throw new Error(err?.message || "unknown error in sendMessage")
    }
})


const fetchMessages = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    try {
        const isChatAvailable = await chatModel.findOne({ _id: chatId, participants: { $in: req.user._id } })

        if (!isChatAvailable) {
            return res.status(403).json(makeResponse("f", "chat unavailable"));
        }

        const messages = await messageModel.find({ chat: chatId }).populate("sender", "firstName lastName profilePic")
        res.json(makeResponse("s", "message fetched successfullly", messages));
    }
    catch (err) {
        throw new Error(err?.message || "unknown error occured")
    }
})

export { sendMessage, fetchMessages };