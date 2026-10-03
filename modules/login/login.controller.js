const User = require("../user/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendPushNotification = require('../../utils/sendNotification');


// module.exports.login = async (req, res) => {

//   try {

//     const {
//       email,
//       password
//     } = req.body;


//     // FIND USER
//     const user =
//       await User.findOne({
//         email
//       });


//     if (!user) {

//       return res.status(401).json({

//         success: false,

//         message:
//           'Invalid email or password'

//       });

//     }


//     // CHECK PASSWORD
//     const passwordMatch =
//       await bcrypt.compare(
//         password,
//         user.password
//       );


//     if (!passwordMatch) {

//       return res.status(401).json({

//         success: false,

//         message:
//           'Invalid email or password'

//       });

//     }


//     // JWT
//     const token =
//       jwt.sign(

//         {
//           id: user._id

//         },

//         process.env.JWT_SECRET,

//         {
//           expiresIn: '7d'
//         }

//       );


//     // SET ONLINE
//     user.isOnline = true;

//     await user.save();


//     // FIND OTHER USER
//     const otherUser =
//       await User.findOne({

//         _id: {
//           $ne: user._id
//         }

//       });


//     // SEND LOGIN NOTIFICATION
//     if (otherUser) {

//       await sendPushNotification(

//         otherUser._id,

//         user.name

//       );

//     }


//     return res.status(200).json({

//       success: true,

//       message:
//         'Login successful',

//       token,

//       user: {

//         _id:
//           user._id,

//         name:
//           user.name,

//         email:
//           user.email,

//         isOnline:
//           user.isOnline,

//         notificationsEnabled:
//           user.notificationsEnabled

//       }

//     });


//   } catch (error) {

//     console.error(
//       'Login error:',
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         'Server error'

//     });

//   }

// };


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