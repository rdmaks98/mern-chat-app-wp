import User from "../models/UserModel.js";
import generateToken from "../middleware/generateTokenMiddleware.js";

const userController = {
    async registerUser(req, res) {
        try {
            const { name, email, password, pic } = req.body;

            if (!name || !email || !password) {
                res.status(400).send({ message: "All input is required" });
            }

            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(409).send({ message: "User Already Exist. Please Login" });
            }

            const user = await User.create({
                name,
                email,
                password,
                pic,
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400).json("User not found");
            }
        }
        catch (err) {
            console.log(err);
        }
    },

    async loginUser(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json("Invalid Email or Password");
        }
    },

    async allUser(req, res) {
        try {
            const keyword = req.query.search
                ? {
                    $or: [
                        { name: { $regex: req.query.search, $options: "i" } },
                        { email: { $regex: req.query.search, $options: "i" } },
                    ],
                }
                : {};
            const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
            res.send(users);
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
}

export default userController;