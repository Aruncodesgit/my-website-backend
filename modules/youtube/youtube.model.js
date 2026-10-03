const mongoose = require('mongoose');

const youtubeLinkSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      trim: true
    },
    comments: {
      type: String,
      trim: true,
      default: ''
    },
    attachedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('YoutubeLink', youtubeLinkSchema);