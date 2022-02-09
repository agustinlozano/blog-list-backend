const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/Blogs')
// const User = require('../models/User')
const initialBlogs = [
  {
    title: 'midudev',
    author: 'Miguel Angel',
    url: 'https://midu.dev/',
    likes: 10
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }
]

const initialUsers = [
  {
    username: 'CatitoX',
    name: 'Cato',
    passwordHash: 'BebeIsMyFriend'
  },
  {
    username: 'Ninito',
    name: 'Gordo Gris',
    passwordHash: 'DadIsTheBest'
  }
]

const getBlogResponse = async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  return { response, blogs }
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  })
  await blog.save()
  await blog.remove()

  return blog.id.toString()
}

const getUserResponse = async () => {
  const response = await api.get('/api/users')
  const body = response.body
  const usernames = body.map(user => user.username)
  const names = body.map(user => user.name)
  const passwordsHash = body.map(user => user.passwordHash)

  return { response, body, usernames, names, passwordsHash }
}

module.exports = {
  initialBlogs,
  initialUsers,
  getBlogResponse,
  nonExistingId,
  getUserResponse,
  api
}
