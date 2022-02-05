const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

const getBlogResponse = async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  return { response, blogs }
}

module.exports = {
  initialBlogs,
  getBlogResponse,
  api
}
