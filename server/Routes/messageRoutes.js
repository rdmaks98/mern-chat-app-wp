import express from "express";
import { sendMessgae, allMessage } from "../controllers/messageController.js";

import protect from "../middleware/authMiddleware.js";
const messageRoute = express.Router();

messageRoute.route("/").post(protect, sendMessgae)
messageRoute.route("/:chatId").get(protect, allMessage)

export default messageRoute;