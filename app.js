const http = require("http")
const FCMService = require("./src/FCMService")
const Debug = require("debug")
const admin = require("firebase-admin")
const key = require("./src/key.json")
const log = Debug("debugger")
Debug.enable("*")
const qs = require("querystring")
const hostname = "0.0.0.0"
const port = 3000
admin.initializeApp({
  credential: admin.credential.cert(key),
})
const registrationTokens = [
  "ca8v83aTTqGVvWRN7xXaPb:APA91bHS2eo2AarfUxG4G3Bjft2WwFdcraUggSjtQBqTJmYt0OUkF-4oK9dSNiteA3gsiaIBsrcyZjySmR96a2PF6pcpbwtjHbijVImH9GLOjL9DhLGixUzsAqgFI1sWdKqQf7H7dCkO",
  "drI6jInJQISAdp8_NA1_0H:APA91bGgYwxnguR9bOmqS0zL1qN-Et1icULqdJgZ79exHm5DI0lPoIvcUVTMyUBjSl4ZOAmB95y1bElN-1xmYIMV0nhAKHxTjC75GZk15VJKXkr4Hnrx3Ac9Ym_IlLB-cf4U723-dW-o",
]

admin
  .messaging()
  .subscribeToTopic(registrationTokens, "love-channel")
  .then((response) => {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log("Successfully subscribed to topic:", response)
  })
  .catch((error) => {
    console.log("Error subscribing to topic:", error)
  })
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")

  if (req.method == "POST") {
    req.on("data", function (data) {
      // let data2 = qs.parse(data.toString())
      // data2 = JSON.stringify(data2)
      // data2 = JSON.parse(JSON.parse(data2))
      let data2 = JSON.parse(data.toString())
      FCMService.sendMessageAdmin(data2["data"])
    })
  }
  res.end("Message sent")
})

server.listen(process.env.PORT || 3000, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
