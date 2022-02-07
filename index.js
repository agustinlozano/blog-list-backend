const app = require('./app')
const http = require('http')

const server = http.createServer(app)

const PORT = process.env.PORT || 3003
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = server
