const router = require('express').Router()
const Blog = require('../models/Blogs')

router.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.post('/', async (request, response, next) => {
  const body = request.body
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

router.get('/:id', async (request, response, next) => {
  const id = request.params.id

  const blog = await Blog.findById(id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

router.delete('/:id', async (request, response, next) => {
  const id = request.params.id

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (deletedBlog) {
    response.status(204).json(deletedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = router
