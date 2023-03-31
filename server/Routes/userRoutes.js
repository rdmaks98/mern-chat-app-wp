import express from 'express';
import userController from '../controllers/userController.js';
import protect from "../middleware/authMiddleware.js";
const userRoute = express.Router();
userRoute.route('/register').post(userController.registerUser).get(protect, userController.allUser)
userRoute.post('/login', userController.loginUser)
export default userRoute;