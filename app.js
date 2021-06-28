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
  "c22QdfvmSkWi3i2Hn_XeRt:APA91bHy4oQPdBXl7iQfU3klx4syzEd8HpyktrqnaVJ3coyNr2_nmQmuAvOxoHQ-JegF0WvuwbSItH4imAKCeJzyvM9Ox40xIFi0xdM0aYybCPJA-LmBMdvRh2WbFdEl0oEiyOX6hCev",
  "cnxzeBWKTe-SxVgE1tb60k:APA91bHx4Ywr0av_a1vuHSzrvSHrTPbDWEgOPMwD8i2APzohb1OapsoIkPWphvUkYie-0m-RckPnTAzIy97YeniHPak0XxdLemykLewsLNGlD67Mki2IEw5IsKY9RHt407gl6gG3HrKA",
  "f1VH8iweR52eaMA6rYxvqj:APA91bH7yEqC13kJknI75zFRP90bDd7aDVJAz2fDrHUkYt4iKvAYQ2A0EnsU_uJh5Cr_8zKvYcUCDoiLpppp7ZqVeSngqA8o7wf7gnLWVkDHndQLOAUGE4b8Y9H9UJeOtI1y_jJyXHUf"
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
