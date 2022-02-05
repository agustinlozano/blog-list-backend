const server = require('../index')
const mongoose = require('mongoose')
const Blog = require('../models/Blogs')
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

  // No tengo este controlador aplicado todavia
  test('a blog is returned as json', async () => {
    const { blogs } = await getBlogResponse()
    const firstBlog = blogs[0]

    await api
      .get(`/api/blogs/${firstBlog.id}`)
      .expect(404)
      .expect('Content-Type', /text\/html/)
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
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
