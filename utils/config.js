require('dotenv').config()

const LOCAL = 3003
const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGO_DB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGO_DB_URI_TEST
}

module.exports = {
  MONGODB_URI,
  PORT,
  LOCAL
}
