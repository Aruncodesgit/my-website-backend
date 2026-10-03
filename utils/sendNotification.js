const webpush = require('web-push');

const PushSubscription = require('../modules/pushSub/pushSub.model');

const User =  require('../modules/user/user.model');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


async function sendPushNotification(
  receiverId,
  senderName
) {

  try {

    // Get receiver
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return;
    }


    // APP SETTING OFF
    if (!receiver.notificationsEnabled) {

      console.log(
        `Notifications OFF for ${receiver.email}`
      );

      return;
    }


    // Get browser subscription
    const subscription =
      await PushSubscription.findOne({
        userId: receiverId
      });


    if (!subscription) {

      console.log(
        `No push subscription for ${receiver.email}`
      );

      return;
    }


    const pushSubscription = {

      endpoint:
        subscription.endpoint,

      keys: {

        p256dh:
          subscription.keys.p256dh,

        auth:
          subscription.keys.auth

      }

    };


    const payload = JSON.stringify({

      notification: {

        title: `${senderName} has logged in`,

        body:
          `${senderName} is now online`,

        icon:
          '/icons/icon-192x192.png',

        badge:
          '/icons/icon-72x72.png',

        data: {

          url: '/login'

        }

      }

    });


    await webpush.sendNotification(
      pushSubscription,
      payload
    );


    console.log(
      `Login notification sent to ${receiver.email}`
    );


  } catch (error) {

    console.error(
      'Push notification error:',
      error
    );


    // Subscription expired / removed
    if (
      error.statusCode === 404 ||
      error.statusCode === 410
    ) {

      await PushSubscription.deleteOne({
        userId: receiverId
      });

      console.log(
        'Deleted expired push subscription'
      );
    }

  }

}


module.exports = sendPushNotification;