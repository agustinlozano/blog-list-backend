const server = require('../index')
const mongoose = require('mongoose')
const Blog = require('../models/Blogs')
const _ = require('lodash')
const {
  initialBlogs,
  getBlogResponse,
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

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const { blogs: beginningBlogs } = await getBlogResponse()
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

    const { blogs: currentBlogs } = await getBlogResponse()
    const lastBlogAdded = _.last(currentBlogs)

    expect(currentBlogs).toHaveLength(beginningBlogs.length + 1)

    expect(lastBlogAdded.author).toBe('Robert C. Martin')
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
  test('a blog is returned as json', async () => {
    const { blogs } = await getBlogResponse()
    const firstBlog = blogs[0]

    await api
      .get(`/api/blogs/${firstBlog.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
