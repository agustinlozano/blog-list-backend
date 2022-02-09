const blogRouter = require('express').Router()
const Blog = require('../models/Blogs')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
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

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (deletedBlog) {
    response.status(204).json(deletedBlog)
  } else {
    response.status(404).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const blogInfo = request.body
  const updatedInfo = {
    title: blogInfo.title,
    author: blogInfo.author,
    url: blogInfo.url,
    likes: blogInfo.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter
