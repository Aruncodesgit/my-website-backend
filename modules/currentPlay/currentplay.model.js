const mongoose = require('mongoose');

const currentPlayingSchema = new mongoose.Schema(
  {
    youtubeLinkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'YoutubeLink',
      required: true
    },

    videoId: {
      type: String,
      required: true,
      trim: true
    },

    isPlaying: {
      type: Boolean,
      default: false
    },

    currentTime: {
      type: Number,
      default: 0
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CurrentPlaying', currentPlayingSchema);