const express = require('express');

const router = express.Router();

const pushController = require('./pushSub.controller');
 
const authMiddleware = require("../../middleware/auth.middleware");

router.get('/', authMiddleware.auth, pushController.getPublicKey);
router.post('/', authMiddleware.auth,  pushController.saveSubscription);


module.exports = router;