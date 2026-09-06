const express = require("express");
const router = express.Router();

const contactController = require("./contact.controller");

// Create contact
router.post("/", contactController.contact);


module.exports = router;