import mongoose from 'mongoose';

const chatModel = mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    groupImage: {
        type: String,
        // default: "https://img.favpng.com/2/12/12/computer-icons-portable-network-graphics-user-profile-avatar-png-favpng-L1ihcbxsHbnBKBvjjfBMFGbb7.jpg"
    },
}, {
    timestamps: true
})

const Chat = mongoose.model("Chat", chatModel);
export default Chat;