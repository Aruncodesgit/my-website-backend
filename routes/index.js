const express = require("express");
const router = express.Router();
 
const contactRoutes = require("../modules/contacts/contact.router.js"); 

router.use("/contact", contactRoutes); 

module.exports = router;