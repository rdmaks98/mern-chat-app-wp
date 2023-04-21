import asyncHandler from "express-async-handler";
import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import { uploadFile } from "../middleware/s3Middleware.js";

const sendMessgae = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    let file = req.file;
    let result;
    if (file) {
        result = await uploadFile(file);
    }
    // if (!content || !chatId) {
    //     console.log("Invalid data passed into request");
    //     return res.sendStatus(400);
    // }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        uploadfile: result ? result.Location : ""
    };
    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
export { sendMessgae, allMessage };