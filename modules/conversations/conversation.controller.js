const Conversation = require("./conversation.model");

module.exports.createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;

        const senderId = req.user.id;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself"
            });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        });

        // Create if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        return res.status(200).json({
            success: true,
            data: conversation
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Conversation processing failed",
            error: err.message
        });
    }
};
 

module.exports.getConversation = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: userId
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            data: conversations
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get conversations",
            error: err.message
        });
    }
};
