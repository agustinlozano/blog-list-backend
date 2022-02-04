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

    expect(result).toBe(34)
  })
})

describe('Favorite blog', () => {
  test('which blog has most likes', () => {
    const mostLikesBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      id: '61fc2b69908a2cb4700758de'
    }
    const result = listHelper.favoriteBlog(listHelper.blogList)

    expect(result).toEqual(mostLikesBlog)
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
    const result = listHelper.favoriteBlog(OnlyOneBlog)

    expect(result).toEqual(OnlyOneBlog[0])
  })

  test('of empty list is an empty object', () => {
    const emptyList = []
    const result = listHelper.favoriteBlog(emptyList)

    expect(result).toEqual({})
  })
})
