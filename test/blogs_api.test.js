const server = require('../index')
const mongoose = require('mongoose')
const Blog = require('../models/Blogs')
const _ = require('lodash')
const {
  initialBlogs,
  getBlogResponse,
  nonExistingId,
  api
} = require('./blog_api_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  /**
   * Para cada contacto del initialBlogs
   * crear un nuevo blogObject del modelo
   * y guardarlo en la base de datos
   *
   * De esta manera si agrego nuevos contactos
   * al initialBlogs, mis test no se rompen
   */
  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET /api/blogs', () => {
  test('contacts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const validBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(validBlog)
      .expect(201)

    const { blogs: blogsAtEnd } = await getBlogResponse()
    const lastBlogAdded = _.last(blogsAtEnd)

    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    expect(lastBlogAdded.author).toBe('Robert C. Martin')
  })

  test('if a valid blog has no likes then the blog has zero likes', async () => {
    const blogWithoutLikes = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: undefined
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /json/)

    const { blogs: blogsAtEnd } = await getBlogResponse()
    const lastBlogAdded = _.last(blogsAtEnd)
    expect(lastBlogAdded.likes).toBe(0)
  })

  test('a invalid blog cannot be added', async () => {
    const invalidBlog = {
      author: 'Agustin Lozano',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(invalidBlog)
      .expect(400)

    const { blogs: blogsAfterPost } = await getBlogResponse()

    expect(blogsAfterPost).toHaveLength(initialBlogs.length)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('delete a blog return 204', async () => {
    const { blogs: beginningBlogs } = await getBlogResponse()
    const deletedBlog = beginningBlogs[0]

    await api
      .delete(`/api/blogs/${deletedBlog.id}`)
      .expect(204)

    const { blogs: currentBlogs } = await getBlogResponse()

    expect(currentBlogs).toHaveLength(beginningBlogs.length - 1)
    expect(currentBlogs).not.toContain(deletedBlog)
  })
})

describe('GET /api/blogs/:id', () => {
  test('a blog can be viewed', async () => {
    const { blogs } = await getBlogResponse()
    const existingBlog = blogs[0]

    await api
      .get(`/api/blogs/${existingBlog.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '123'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('database properties', () => {
  test('the id is defined correctly', async () => {
    const { blogs } = await getBlogResponse()
    const existingBlog = blogs[0]

    expect(existingBlog.id).toBeDefined()
  })
})

describe('test the inicial blogs', () => {
  test('there are four blogs in the list', async () => {
    const { blogs } = await getBlogResponse()

    expect(blogs.length).toBe(initialBlogs.length)
  })

  test('a blog is by Midudev', async () => {
    const miduBlog = {
      title: 'midudev',
      author: 'Miguel Angel',
      url: 'https://midu.dev/',
      likes: 10
    }
    const { blogs } = await getBlogResponse()
    const authors = blogs.map(blog => blog.author)

    expect(authors).toContain(miduBlog.author)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
