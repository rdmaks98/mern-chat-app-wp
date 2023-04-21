import mongoose from 'mongoose';

const messageModel = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    uploadfile: {
        type: String,
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message", messageModel);
export default Message;