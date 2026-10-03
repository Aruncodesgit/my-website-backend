const express = require('express');

const router = express.Router();

const settingsController = require('./settings.controller');

const authMiddleware = require("../../middleware/auth.middleware");

router.get('/', authMiddleware.auth, settingsController.getNotifications);

router.put('/', authMiddleware.auth, settingsController.updateNotifications);


module.exports = router;