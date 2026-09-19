const express = require("express");
const router = express.Router();

const messageController = require("./message.controller");

const authMiddleware = require("../../middleware/auth.middleware");

router.post("/", authMiddleware.auth,  messageController.sendMessage );
router.put("/:conversationId/read", authMiddleware.auth, messageController.markMessagesAsRead );

router.get("/", authMiddleware.auth,  messageController.getMessages );
router.delete("/", authMiddleware.auth,  messageController.deleteAllMessages );
router.delete("/:id", authMiddleware.auth,  messageController.deleteMessage );
router.put("/:id", authMiddleware.auth,  messageController.editMessage);

module.exports = router;
