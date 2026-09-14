const express = require("express");
const router = express.Router();
 
const contactRoutes = require("../modules/contacts/contact.router.js"); 
const userRoutes = require("../modules/user/user.router.js"); 
const loginRoutes = require("../modules/login/login.router.js"); 
const conversationRoutes = require("../modules/conversations/conversation.router.js"); 
const messageRoutes = require("../modules/message/message.router.js"); 

router.use("/contact", contactRoutes); 
router.use("/user", userRoutes); 
router.use("/login", loginRoutes); 
router.use("/logout", loginRoutes); 
router.use("/conversation", conversationRoutes); 
router.use("/message", messageRoutes); 

module.exports = router;