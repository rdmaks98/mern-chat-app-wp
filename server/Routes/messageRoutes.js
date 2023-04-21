import express from "express";
import { sendMessgae, allMessage } from "../controllers/messageController.js";
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
    dest: "src/uploads/media",
    fileFilter: fileFilter
});
import protect from "../middleware/authMiddleware.js";
const messageRoute = express.Router();

messageRoute.route("/").post(protect, upload.single('image'), sendMessgae)
messageRoute.route("/:chatId").get(protect, allMessage)

export default messageRoute;