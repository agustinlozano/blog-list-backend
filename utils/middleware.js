const handleErrors = (error, req, res, next) => {
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.message })
  } else if (error.name === 'TypeError') {
    res.status(404).send({ error: error.message })
  } else {
    console.error(error.message)
    console.error(error.name)
    res.status(500).send({ error: error.message })
  }
}

const requestLogger = (request, response, next) => {
  console.log('---------------')
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('---------------')
  next()
}

const notFound = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  handleErrors,
  requestLogger,
  notFound
}
