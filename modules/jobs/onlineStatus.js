const User = require("../user/user.model");

const ONLINE_TIMEOUT = 20 * 1000; // 20 seconds

const checkOfflineUsers = async () => {
    try {
        const cutoffTime = new Date(Date.now() - ONLINE_TIMEOUT);

        const result = await User.updateMany(
            {
                isOnline: true,
                lastSeen: {
                    $lt: cutoffTime
                }
            },
            {
                $set: {
                    isOnline: false
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(
                `${result.modifiedCount} user(s) marked offline`
            );
        }

    } catch (error) {
        console.error("Online status checker error:", error);
    }
};

setInterval(checkOfflineUsers,  5 * 1000);

module.exports = checkOfflineUsers;