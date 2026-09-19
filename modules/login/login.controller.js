const User = require("../user/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Update online status
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: err.message
        });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isOnline = false;
        user.lastSeen = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Logout successful",
            user: {
                id: user._id,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: err.message
        });
    }
};
  

module.exports.browserClose = async (req, res) => {
    try { 

        const userId = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                isOnline: false,
                lastSeen: new Date()
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("USER MARKED OFFLINE:", userId);

        return res.status(200).json({
            success: true,
            message: "User marked offline"
        });

    } catch (error) {
        console.error("BROWSER CLOSE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update status"
        });
    }
};
 

// HEARTBEAT
module.exports.heartbeat = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                isOnline: true,
                lastSeen: new Date()
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen
        });

    } catch (error) {
        console.error("Heartbeat error:", error);

        return res.status(500).json({
            success: false,
            message: "Heartbeat failed"
        });
    }
};