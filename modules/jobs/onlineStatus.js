const User = require("../user/user.model");

const ONLINE_TIMEOUT = 30 * 1000; // 30 seconds

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

setInterval(checkOfflineUsers, 10 * 1000);

module.exports = checkOfflineUsers;