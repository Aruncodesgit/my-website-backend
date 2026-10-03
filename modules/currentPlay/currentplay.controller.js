const CurrentPlaying = require('./currentplay.model');
const YoutubeLink = require('../youtube/youtube.model');
// Change the path above to your actual YoutubeLink model path


// --------------------------------------------------
// Extract YouTube Video ID
// --------------------------------------------------
function getYoutubeVideoId(url) {
  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname === 'www.youtube.com' ||
      parsedUrl.hostname === 'youtube.com' ||
      parsedUrl.hostname === 'm.youtube.com'
    ) {
      const videoId = parsedUrl.searchParams.get('v');

      if (videoId) {
        return videoId;
      }

      // youtube.com/shorts/VIDEO_ID
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname
          .split('/shorts/')[1]
          .split('/')[0];
      }

      // youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname
          .split('/embed/')[1]
          .split('/')[0];
      }
    }

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname
        .split('/')[1]
        .split('/')[0];
    }

    return null;

  } catch (error) {
    return null;
  }
}


// --------------------------------------------------
// Select YouTube Video
// --------------------------------------------------
exports.selectYoutubeVideo = async (req, res) => {
  try {

    const userId = req.user.id || req.user._id;

    const {
      youtubeLinkId
    } = req.body;


    if (!youtubeLinkId) {
      return res.status(400).json({
        success: false,
        message: 'youtubeLinkId is required'
      });
    }


    // Get YouTube link from existing collection
    const youtubeLink = await YoutubeLink.findById(
      youtubeLinkId
    );


    if (!youtubeLink) {
      return res.status(404).json({
        success: false,
        message: 'YouTube link not found'
      });
    }


    // Extract video ID
    const videoId = getYoutubeVideoId(
      youtubeLink.link
    );


    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }


    // Update current playing
    const currentPlaying =
      await CurrentPlaying.findOneAndUpdate(
        {},
        {
          youtubeLinkId: youtubeLinkId,
          videoId: videoId,
          isPlaying: false,
          currentTime: 0,
          updatedBy: userId
        },
        {
          new: true,
          upsert: true
        }
      );


    return res.status(200).json({
      success: true,
      message: 'YouTube video selected',
      data: currentPlaying
    });

  } catch (error) {

    console.error(
      'Select YouTube video error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// --------------------------------------------------
// Get Current Playing Video
// --------------------------------------------------
exports.getCurrentPlaying = async (req, res) => {
  try {

    const currentPlaying =
      await CurrentPlaying
        .findOne({})
        .populate('youtubeLinkId');


    if (!currentPlaying) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }


    return res.status(200).json({
      success: true,
      data: currentPlaying
    });

  } catch (error) {

    console.error(
      'Get current playing error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// --------------------------------------------------
// Update Play / Pause
// --------------------------------------------------
exports.updatePlayback = async (req, res) => {
  try {

    const userId = req.user.id || req.user._id;

    const {
      isPlaying,
      currentTime
    } = req.body;


    if (typeof isPlaying !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isPlaying is required'
      });
    }


    const currentPlaying =
      await CurrentPlaying.findOneAndUpdate(
        {},
        {
          isPlaying: isPlaying,
          currentTime: Number(currentTime) || 0,
          updatedBy: userId
        },
        {
          new: true
        }
      );


    if (!currentPlaying) {
      return res.status(404).json({
        success: false,
        message: 'No YouTube video is currently selected'
      });
    }


    return res.status(200).json({
      success: true,
      message: 'Playback updated',
      data: currentPlaying
    });

  } catch (error) {

    console.error(
      'Update playback error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 


exports.removeCurrentPlaying = async (req, res) => {
  try {

    const currentPlaying =
      await CurrentPlaying.findOneAndDelete({});

    if (!currentPlaying) {
      return res.status(404).json({
        success: false,
        message: 'No current playing video found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Current playing video removed'
    });

  } catch (error) {

    console.error(
      'Remove current playing error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }
};