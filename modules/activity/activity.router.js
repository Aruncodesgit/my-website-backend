const express = require("express");

const router = express.Router();

const activityController = require("./activity.controller");

const authMiddleware = require("../../middleware/auth.middleware");


router.get('/', authMiddleware.auth, activityController.getActivities);
router.delete('/', authMiddleware.auth,  activityController.deleteAllActivities);


module.exports = router;