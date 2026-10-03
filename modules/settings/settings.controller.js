const User = require('../user/user.model');


exports.updateNotifications =
  async (req, res) => {

    try {

      const userId =
        req.user.id;

      const {
        enabled
      } = req.body;


      if (typeof enabled !== 'boolean') {

        return res.status(400).json({

          success: false,

          message:
            'enabled must be true or false'

        });

      }


      const user =
        await User.findByIdAndUpdate(

          userId,

          {
            notificationsEnabled:
              enabled
          },

          {
            returnDocument: 'after'
          }

        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            'User not found'

        });

      }


      res.status(200).json({

        success: true,

        message:
          enabled
            ? 'Notifications enabled'
            : 'Notifications disabled',

        notificationsEnabled:
          user.notificationsEnabled

      });


    } catch (error) {

      console.error(
        'Notification setting error:',
        error
      );

      res.status(500).json({

        success: false,

        message:
          'Failed to update notification setting'

      });

    }

  };


  exports.getNotifications = async (req, res) => {

  try {

    const userId = req.user.id;

    const user = await User.findById(
      userId
    ).select('notificationsEnabled');

    if (!user) {

      return res.status(404).json({

        success: false,

        message: 'User not found'

      });

    }

    res.status(200).json({

      success: true,

      notificationsEnabled:
        user.notificationsEnabled

    });

  } catch (error) {

    console.error(
      'Get notification setting error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to get notification setting'

    });

  }

};