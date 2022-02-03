const listHelper = require('../utils/list_helper')

test('dummy always return one', () => {
  const blogs = listHelper.blogList
  const result = listHelper.dummy(blogs)

  expect(result).toBe(1)
})

describe('Total likes', () => {
  test('of empty list is zero', () => {
    const emptyList = []
    const result = listHelper.totalLikes(emptyList)

    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const OnlyOneBlog = [
      {
        title: 'midudev',
        author: 'Miguel Angel',
        url: 'https://midu.dev/',
        likes: 20,
        id: '61fbf3a29337e4076ce5148b'
      }
    ]
    const result = listHelper.totalLikes(OnlyOneBlog)

    expect(result).toBe(OnlyOneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = listHelper.blogList
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(25)
  })
})
