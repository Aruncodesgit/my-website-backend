const Activity = require("./activity.model");


exports.getActivities = async (req, res) => {

    try {

        const activities = await Activity.find()
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .limit(3);

        const data = activities.map(item => ({
            _id: item._id,
            type: item.type,
            message: item.message,
            userName: item.userId?.name || '',
            referenceId: item.referenceId,
            createdAt: item.createdAt
        }));

        return res.status(200).json({
            success: true,
            message: 'Activities fetched successfully',
            data: data
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch activities'
        });

    }

};

exports.deleteAllActivities = async (req, res) => {
    try {
        await Activity.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'All activities deleted successfully'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete all activities'
        });
    }
};