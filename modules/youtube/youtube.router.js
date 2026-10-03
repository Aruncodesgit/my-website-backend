const express = require("express");
const router = express.Router();

const youtubeController = require("./youtube.controller");

const authMiddleware = require("../../middleware/auth.middleware");

  
router.post('/', authMiddleware.auth,  youtubeController.addYoutubeLink);
router.get('/', authMiddleware.auth, youtubeController.getYoutubeLinks);
router.put('/:id/read', authMiddleware.auth, youtubeController.markYoutubeLinkAsRead);
router.delete('/', authMiddleware.auth,  youtubeController.deleteAllYoutubeLinks);
module.exports = router;
