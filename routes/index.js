const express = require("express");
const router = express.Router();
 
const contactRoutes = require("../modules/contacts/contact.router.js"); 
const userRoutes = require("../modules/user/user.router.js"); 
const loginRoutes = require("../modules/login/login.router.js"); 
const conversationRoutes = require("../modules/conversations/conversation.router.js"); 
const messageRoutes = require("../modules/message/message.router.js"); 
const youtubeRoutes = require("../modules/youtube/youtube.router.js"); 
const activityRoutes = require("../modules/activity/activity.router.js"); 
const currentPlayRoutes = require("../modules/currentPlay/currentplay.router.js"); 

router.use("/contact", contactRoutes); 
router.use("/user", userRoutes); 
router.use("/login", loginRoutes); 
router.use("/logout", loginRoutes); 
router.use("/conversation", conversationRoutes); 
router.use("/message", messageRoutes); 
router.use("/youtube", youtubeRoutes);
router.use("/activity", activityRoutes); 
router.use("/currentPlay", currentPlayRoutes); 
module.exports = router;