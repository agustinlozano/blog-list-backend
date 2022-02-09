const server = require('../index')
const mongoose = require('mongoose')
const User = require('../models/User')
const {
  api,
  getUserResponse,
  initialUsers
} = require('./blog_api_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const firstUser = new User(initialUsers[0])
  const secondUser = new User(initialUsers[1])

  await firstUser.save()
  await secondUser.save()
})

describe('Test initial users', () => {
  test('there are two users in the database', async () => {
    const { body: users } = await getUserResponse()

    expect(users).toHaveLength(initialUsers.length)
  })
})

describe('GET /api/users', () => {
  test('user are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('POST /api/users', () => {
  test('success with status code 201 when a valid user is passed', async () => {
    const validUser = {
      username: 'MobBebe',
      name: 'bebe',
      password: 'CatoIsAnIdiot'
    }

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /json/)

    const { body: usersAtEnd } = await getUserResponse()
    const { passwordsHash } = await getUserResponse()
    const { names } = await getUserResponse()

    expect(usersAtEnd).toHaveLength(initialUsers.length + 1)
    expect(names).toContain('bebe')
    expect(passwordsHash).not.toContain('CatoIsAnIdiot')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
