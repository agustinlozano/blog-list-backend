const router = require('express').Router()
const Blog = require('../models/Blogs')

router.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => response.json(blogs))
    .catch(err => next(err))
})

router.post('/', (request, response, next) => {
  const body = request.body
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  newBlog
    .save()
    .then(result => response.status(201).json(result))
    .catch(err => next(err))
})

router.get('/:id', (request, response, next) => {
  const id = request.params.id

  Blog
    .findById(id)
    .then(result => {
      if (result) {
        return response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

router.delete('/:id', (request, response, next) => {
  const id = request.params.id

  Blog
    .findByIdAndDelete(id)
    .then(result => response.status(204).json(result))
    .catch(err => next(err))
})

module.exports = router
