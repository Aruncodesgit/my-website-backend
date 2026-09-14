const express = require("express");
const router = express.Router();

const conversationController = require("./conversation.controller");

const  authMiddleware = require("../../middleware/auth.middleware");

router.post("/", authMiddleware.auth,  conversationController.createConversation );
router.get("/", authMiddleware.auth,  conversationController.getConversation);
module.exports = router;
