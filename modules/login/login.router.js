const express = require("express");
const router = express.Router();
const  authMiddleware = require("../../middleware/auth.middleware");
const loginController  = require("./login.controller"); 
router.post("/", loginController.login);
router.post("/:id", authMiddleware.auth, loginController.logout);
module.exports = router;