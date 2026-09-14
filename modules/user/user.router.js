const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

// Create user
router.post("/", userController.user);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);


module.exports = router;