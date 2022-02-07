const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const router = require('./controllers/blogs')
const {
  handleErrors,
  requestLogger,
  notFound
} = require('./utils/middleware')

/* conexion a mongoDB */
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', router)

app.use(notFound)
app.use(handleErrors)

module.exports = app
