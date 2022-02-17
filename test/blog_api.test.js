const server = require('../index')
const mongoose = require('mongoose')
const Blog = require('../models/Blogs')
const { getUserResponse } = require('./user_helper')
const getAnUserToken = require('./login_helper')
const _ = require('lodash')
const api = require('./helper')
const {
  initialBlogs,
  getBlogResponse,
  nonExistingId
} = require('./blog_helper')

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
    const token = await getAnUserToken()

    console.log({ token })

    const { ids } = await getUserResponse()
    const validBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: ids[0]
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(validBlog)
      .expect(201)

    const { response: blogsAtEnd } = await getBlogResponse()
    const lastBlogAdded = _.last(blogsAtEnd)

    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    expect(lastBlogAdded.author).toBe('Robert C. Martin')
  })

  test('if a valid blog has no likes then the blog has zero likes', async () => {
    const token = await getAnUserToken()
    const { ids } = await getUserResponse()
    const blogWithoutLikes = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: undefined,
      user: ids[0]
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /json/)

    const { response: blogsAtEnd } = await getBlogResponse()
    const lastBlogAdded = _.last(blogsAtEnd)
    expect(lastBlogAdded.likes).toBe(0)
  })

  test('fails with status code 400 when a invalid blog is passed', async () => {
    const token = await getAnUserToken()
    const { ids } = await getUserResponse()
    const invalidBlog = {
      author: 'Agustin Lozano',
      likes: 10,
      user: ids[0]
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(invalidBlog)
      .expect(400)

    const { response: blogsAfterPost } = await getBlogResponse()

    expect(blogsAfterPost).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 401 when token is missing', async () => {
    const token = undefined
    const invalidBlog = {
      title: 'Some blog title',
      author: 'PhD Cato',
      url: 'http://blog.cato.com//2017/05/05/TestDefinitions.htmll',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(invalidBlog)
      .expect(401)
      .expect({ error: 'jwt malformed' })

    const { response: blogsAfterPost } = await getBlogResponse()

    expect(blogsAfterPost).toHaveLength(initialBlogs.length)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('a existing blog return 204', async () => {
    const token = await getAnUserToken()
    const { response: blogsAtStart } = await getBlogResponse()
    const deletedBlog = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${deletedBlog.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const { response: blogsAtEnd } = await getBlogResponse()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd).not.toContain(deletedBlog)
  })

  test('fails with status code 400 with an invalid ID', async () => {
    const token = await getAnUserToken()

    await api
      .delete('/api/blogs/1234')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .expect({ error: 'id used is malformed' })

    const { response: blogs } = await getBlogResponse()

    expect(blogs).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 404 with a nonexisting ID', async () => {
    const token = await getAnUserToken()
    const validNonexistingId = await nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)

    const { response: blogs } = await getBlogResponse()

    expect(blogs).toHaveLength(initialBlogs.length)
  })
})

describe('GET /api/blogs/:id', () => {
  test('a blog can be viewed', async () => {
    const token = await getAnUserToken()
    const { response: blogs } = await getBlogResponse()
    const existingBlog = blogs[0]

    await api
      .get(`/api/blogs/${existingBlog.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const token = await getAnUserToken()
    const validNonexistingId = await nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const token = await getAnUserToken()

    await api
      .get('/api/blogs/1234')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .expect({ error: 'id used is malformed' })
  })
})

describe('PUT /api/blogs/:id', () => {
  const catBlogInfo = {
    title: 'Cats are going to rule the entire world',
    author: 'Phd Ninito',
    url: 'https://www.newurl.com/new-blog',
    likes: 13
  }

  test('succeeds with a valid id', async () => {
    const token = await getAnUserToken()
    const { response: blogsAtStart } = await getBlogResponse()
    const existingblog = blogsAtStart[0]

    const blogInfo = {
      title: 'New title',
      author: existingblog.author,
      url: 'https://www.newurl.com/new-blog',
      likes: 13
    }

    await api
      .put(`/api/blogs/${existingblog.id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(blogInfo)
      .expect(200)

    const { response: blogsAtEnd } = await getBlogResponse()
    const titles = blogsAtEnd.map(blog => blog.title)
    const urls = blogsAtEnd.map(blog => blog.url)

    expect(titles).toContain('New title')
    expect(urls).toContain('https://www.newurl.com/new-blog')
  })

  test('fails with statuscode 404 if id does not exist', async () => {
    const token = await getAnUserToken()
    const validNonexistingId = await nonExistingId()

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(catBlogInfo)
      .expect(404)

    const { response: blogsAfterPut } = await getBlogResponse()
    const titles = blogsAfterPut.map(blog => blog.title)

    expect(titles).not.toContain('Cats are going to rule the entire world')
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const token = await getAnUserToken()

    await api
      .put('/api/blogs/1234')
      .set('Authorization', 'Bearer ' + token)
      .send(catBlogInfo)
      .expect(400)
      .expect({ error: 'id used is malformed' })

    const { response: blogsAfterPut } = await getBlogResponse()
    const titles = blogsAfterPut.map(blog => blog.title)

    expect(titles).not.toContain('Cats are going to rule the entire world')
  })
})

describe('database properties', () => {
  test('the id is defined correctly', async () => {
    const { response: blogs } = await getBlogResponse()
    const existingBlog = blogs[0]

    expect(existingBlog.id).toBeDefined()
  })
})

describe('test the inicial blogs', () => {
  test('there are four blogs in the list', async () => {
    const { response: blogs } = await getBlogResponse()

    expect(blogs.length).toBe(initialBlogs.length)
  })

  test('a blog is by Midudev', async () => {
    const miduBlog = {
      title: 'midudev',
      author: 'Miguel Angel',
      url: 'https://midu.dev/',
      likes: 10
    }
    const { response: blogs } = await getBlogResponse()
    const authors = blogs.map(blog => blog.author)

    expect(authors).toContain(miduBlog.author)
  })
})

describe('when an unknown endpoint is passed as a route', () => {
  test('returns a status code 404', async () => {
    const unknownEndpoint = '/an/Invalid/RouteLikeThis'

    await api
      .get(unknownEndpoint)
      .expect(404)
      .expect({ error: 'unknown endpoint' })
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
