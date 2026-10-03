const express = require('express');

const router = express.Router();

const currentPlayingController = require('./currentplay.controller');

const authMiddleware = require('../../middleware/auth.middleware');


// Select YouTube video
router.post(
    '/select',
    authMiddleware.auth,
    currentPlayingController.selectYoutubeVideo
);


// Get currently selected video
router.get(
    '/',
    authMiddleware.auth,
    currentPlayingController.getCurrentPlaying
);


// Play / Pause
router.put(
    '/playback',
    authMiddleware.auth,
    currentPlayingController.updatePlayback
);


// delete current time
router.delete('/', authMiddleware.auth, currentPlayingController.removeCurrentPlaying
);

module.exports = router;