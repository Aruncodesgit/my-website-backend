const User = require("./user.model");
const bcrypt = require("bcryptjs");

module.exports.user = async (req, res, next) => {
    try {
        const { name,email, password, isOnline } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name and email, password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email:email,
            password: hashedPassword,
            isOnline: isOnline || false,
            lastSeen: isOnline ? new Date() : null
        });

        const doc = await user.save();

        return res.status(201).json({
            success: true,
            message: "User saved successfully",
            data: {
                id: doc._id,
                name: doc.name,
                isOnline: doc.isOnline,
                lastSeen: doc.lastSeen
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User processing failed",
            error: err.message
        });
    }
};


module.exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: err.message
        });
    }
};

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: err.message
        });
    }
};
