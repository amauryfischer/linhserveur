const http = require("http")
var FCMService = require("./src/FCMService")

const hostname = "0.0.0.0"
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")
  FCMService.sendFcmMessage(FCMService.buildCommonMessage())
  res.end("Message sent")
})

server.listen(process.env.PORT || 3000, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
