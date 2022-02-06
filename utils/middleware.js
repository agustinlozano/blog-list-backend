const handleErrors = (error, req, res, next) => {
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.message })
  } else {
    console.log(error.message)
    res.status(500).send({ error: error.message })
  }
}

module.exports = handleErrors
