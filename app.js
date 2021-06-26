const http = require("http")
const { buildCommonMessage, sendFcmMessage } = require("./src/FCMService")

const hostname = "127.0.0.1"
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")
  sendFcmMessage(buildCommonMessage())
  res.end("Message sent")
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
