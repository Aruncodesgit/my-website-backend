const Message = require("./message.model");
const Conversation = require("../conversations/conversation.model");

module.exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;

        const {
            conversationId,
            receiverId,
            text
        } = req.body;

        if (!conversationId || !receiverId || !text) {
            return res.status(400).json({
                success: false,
                message: "conversationId, receiverId and text are required"
            });
        }

        // Make sure this conversation belongs to both users
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: {
                $all: [senderId, receiverId]
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Save message
        const message = await Message.create({
            conversationId,
            senderId,
            receiverId,
            text
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Message processing failed",
            error: err.message
        });
    }
};
 
const deleteAt = new Date(Date.now() + 20 * 60 * 1000);

module.exports.markMessagesAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        const result = await Message.updateMany(
            {
                conversationId: conversationId,
                receiverId: userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    deleteAt: deleteAt
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Messages marked as read",
            modifiedCount: result.modifiedCount
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to mark messages as read",
            error: err.message
        });
    }
};

module.exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get messages",
            error: err.message
        });
    }
};


module.exports.deleteAllMessages = async (req, res) => {
    try {

        const result = await Message.deleteMany({});

        return res.status(200).json({
            success: true,
            message: "All messages deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete messages",
            error: err.message
        });
    }
};


module.exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: message
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: err.message
        });
    }
};


module.exports.editMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message text is required"
            });
        }

        const message = await Message.findOne({
            _id: id,
            senderId: userId
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found or you cannot edit this message"
            });
        }

        message.text = text.trim();
        message.isEdited = true;

        await message.save();

        return res.status(200).json({
            success: true,
            message: "Message edited successfully",
            data: message
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit message",
            error: err.message
        });
    }
};