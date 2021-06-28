/**
 * Firebase Cloud Messaging (FCM) can be used to send messages to clients on iOS, Android and Web.
 *
 * This sample uses FCM to send two types of messages to clients that are subscribed to the `news`
 * topic. One type of message is a simple notification message (display message). The other is
 * a notification message (display notification) with platform specific customizations. For example,
 * a badge is added to messages that are sent to iOS devices.
 */
const https = require("https")
const { google } = require("googleapis")
const admin = require("firebase-admin")
const PROJECT_ID = "lovelinh-41fa5"
const HOST = "fcm.googleapis.com"
const PATH = "/v1/projects/" + PROJECT_ID + "/messages:send"
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging"
const SCOPES = [MESSAGING_SCOPE]
const key = require("./key.json")
const sendMessageAdmin = ({ message, title }) => {
  // Initialize the app with a service account, granting admin privileges
  const message = {
    topic: "/topics/love-channel",
    notification: {
      title,
      body: message,
    },
  }

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response)
    })
    .catch((error) => {
      console.log("Error sending message:", error)
    })
}

/**
 * Get a valid access token.
 */
// [START retrieve_access_token]
function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = require("./key.json")
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null,
    )
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}
// [END retrieve_access_token]

/**
 * Send HTTP request to FCM with given message.
 *
 * @param {object} fcmMessage will make up the body of the request.
 */
function sendFcmMessage(fcmMessage) {
  getAccessToken().then(function (accessToken) {
    const options = {
      hostname: HOST,
      path: PATH,
      method: "POST",
      // [START use_access_token]
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      // [END use_access_token]
    }

    const request = https.request(options, function (resp) {
      resp.setEncoding("utf8")
      resp.on("data", function (data) {
        console.log("Message sent to Firebase for delivery, response:")
        console.log(data)
      })
    })

    request.on("error", function (err) {
      console.log("Unable to send message to Firebase")
      console.log(err)
    })

    request.write(JSON.stringify(fcmMessage))
    request.end()
  })
}
/**
 * Construct a JSON object that will be used to define the
 * common parts of a notification message that will be sent
 * to any app instance subscribed to the news topic.
 */
function buildCommonMessage() {
  return {
    message: {
      topic: "love-channel",
      notification: {
        title: "FCM Notification",
        body: "Notification from FCM",
      },
    },
  }
}
/**
 * Construct a JSON object that will be used to customize
 * the messages sent to iOS and Android devices.
 */
function buildOverrideMessage() {
  const fcmMessage = buildCommonMessage()
  const apnsOverride = {
    payload: {
      aps: {
        badge: 1,
      },
    },
    headers: {
      "apns-priority": "10",
    },
  }

  const androidOverride = {
    notification: {
      click_action: "android.intent.action.MAIN",
    },
  }

  fcmMessage["message"]["android"] = androidOverride
  fcmMessage["message"]["apns"] = apnsOverride

  return fcmMessage
}

module.exports = {
  sendMessageAdmin,
  buildOverrideMessage,
  buildCommonMessage,
  sendFcmMessage,
}
