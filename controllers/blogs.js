const blogRouter = require('express').Router()
const Blog = require('../models/Blogs')
const User = require('../models/User')
const tokenExtractor = require('../utils/tokenExtractor')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(blogs)
})

blogRouter.post('/', tokenExtractor, async (request, response) => {
  const {
    title,
    author,
    url,
    likes = 0
  } = request.body

  const { userId } = request
  /* busco el usuario responsable de crear el blog */
  const user = await User.findById(userId)

  /* construyo el objeto del blog y no olvido atrubuir el usuario */
  const newBlog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  /* guardo el nuevo blog en la base de datos */
  const savedBlog = await newBlog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  const newUserInfo = {
    username: user.username,
    name: user.name,
    blogs: user.blogs
  }

  /* Actualizo la informacion del usuario en la base de datos */
  await User.findByIdAndUpdate(user._id, newUserInfo, { new: true })

  response.status(201).json(savedBlog)
})

blogRouter.get('/:id', tokenExtractor, async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.delete('/:id', tokenExtractor, async (request, response) => {
  const id = request.params.id
  const { userId } = request

  const userDB = await User.findById(userId)
  const userBlogsUpdated = userDB.blogs.filter(blog =>
    blog.toString() !== id
  )

  userDB.blogs = userBlogsUpdated

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (deletedBlog) {
    const updatedInfo = await User.findByIdAndUpdate(userId, userDB, { new: true })

    if (updatedInfo) {
      response.status(204).end()
    } else {
      response.status(404)
        .send('Error: The blog has been deleted but the user information could not be updated')
    }
  } else {
    response.status(404).end()
  }
})

blogRouter.put('/:id', tokenExtractor, async (request, response) => {
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
