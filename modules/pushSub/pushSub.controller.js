const PushSubscription = require('./pushSub.model');


// GET PUBLIC VAPID KEY
exports.getPublicKey = async (req, res) => {

  try {

    res.status(200).json({

      success: true,

      publicKey:
        process.env.VAPID_PUBLIC_KEY

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: 'Failed to get public key'

    });

  }

};


// SAVE BROWSER SUBSCRIPTION
exports.saveSubscription = async (req, res) => {

  try {

    const userId = req.user.id;

    const subscription = req.body;


    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid push subscription'

      });

    }


    const saved =
      await PushSubscription.findOneAndUpdate(

        { userId },

        {

          userId,

          endpoint:
            subscription.endpoint,

          keys: {

            p256dh:
              subscription.keys.p256dh,

            auth:
              subscription.keys.auth

          }

        },

        {
          upsert: true,
          returnDocument: 'after'
        }

      );


    res.status(200).json({

      success: true,

      message:
        'Push subscription saved',

      data: saved

    });


  } catch (error) {

    console.error(
      'Save subscription error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to save subscription'

    });

  }

};