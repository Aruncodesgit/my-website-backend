const YoutubeLink = require('./youtube.model');
const User = require('../user/user.model');
const Activity = require('../activity/activity.model');
exports.addYoutubeLink = async (req, res) => {

    try {


        const link = req.body.link;

        const userId = req.user.id;
        const comments = req.body.comments || '';

        if (!link) {
            return res.status(400).json({
                success: false,
                message: 'YouTube link is required'
            });
        }

        const otherUser = await User.findOne({
            _id: { $ne: userId }
        });

        const youtubeLink = new YoutubeLink({
            link: link,
            comments: comments,
            attachedBy: userId,
            readBy: otherUser?._id || null,
            isRead: false
        });

        await youtubeLink.save();

        await Activity.create({
            userId: userId,
            type: 'youtube',
            message: 'YouTube link',
        });

        return res.status(201).json({
            success: true,
            message: 'YouTube link added successfully'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to add YouTube link'
        });

    }

};

exports.getYoutubeLinks = async (req, res) => {
    try {

        const links = await YoutubeLink.find()
            .populate('attachedBy', 'name')
            .populate('readBy', 'name')
            .sort({ createdAt: -1 });

        const data = links.map(item => ({
            _id: item._id,
            link: item.link,
            comments: item.comments,
            userName: item.attachedBy?.name || '',
            readBy: item.readBy,
            isRead: item.isRead,
            createdAt: item.createdAt
        }));

        return res.status(200).json({
            success: true,
            message: 'YouTube links fetched successfully',
            data: data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch YouTube links'
        });
    }
};

exports.markYoutubeLinkAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const linkId = req.params.id;    
        const youtubeLink = await YoutubeLink.findById(linkId);

        if (!youtubeLink) {
            return res.status(404).json({
                success: false,
                message: 'YouTube link not found'
            });
        }

        // Only the intended reader can mark it as read
        if (youtubeLink.readBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to mark this link as read'
            });
        }

        // Already read → don't change anything
        if (youtubeLink.isRead) {
            return res.status(200).json({
                success: true,
                message: 'YouTube link already read'
            });
        }

        // First read
        youtubeLink.isRead = true;

        await youtubeLink.save();

        return res.status(200).json({
            success: true,
            message: 'YouTube link marked as read'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to mark YouTube link as read'
        });
    }
};


exports.deleteAllYoutubeLinks = async (req, res) => {

    try {

        await YoutubeLink.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'All YouTube links deleted successfully'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete YouTube links'
        });

    }

};