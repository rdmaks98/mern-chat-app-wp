import express from "express";
import { accessChat, addGroup, createGroupChat, fetchChat, removeFromGroup, renameGroup } from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";

// * defined filter
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(new Error('File format should be PNG,JPG,JPEG,WEBP'), false); // if validation failed then generate error
    }
};

// *file upload using validation
const upload = multer({
    dest: "src/uploads/",
    fileFilter: fileFilter
});

const chatRoute = express.Router();

chatRoute.route("/").post(protect, accessChat)
chatRoute.route("/").get(protect, fetchChat)
chatRoute.route("/group").post(protect, upload.single('groupImage'), createGroupChat)
chatRoute.route("/renamegroup").put(protect, upload.single('groupImage'), renameGroup)
chatRoute.route("/removegroup").put(protect, removeFromGroup)
chatRoute.route("/addgroup").put(protect, addGroup)

export default chatRoute;