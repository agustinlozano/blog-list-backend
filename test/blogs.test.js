const listHelper = require('../utils/list_helper')

describe('Testing useless method', () => {
  test('dummy always return one', () => {
    const blogs = listHelper.blogList
    const result = listHelper.dummy(blogs)

    expect(result).toBe(1)
  })
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
  test('of empty list is an empty object', () => {
    const emptyList = []
    const result = listHelper.favoriteBlog(emptyList)

    expect(result).toEqual({})
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

  test('of a bigger list is calculated right', () => {
    const mostLikesBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    const result = listHelper.favoriteBlog(listHelper.blogList)

    delete result.url
    delete result.id

    expect(result).toEqual(mostLikesBlog)
  })
})

describe('Most Blogs', () => {
  test('of empty list is an empty object', () => {
    const result = listHelper.mostBlogs([])

    expect(result).toEqual({})
  })

  test('when list has only one blog equals the blog of that', () => {
    const OnlyOneBlog = [{
      title: 'midudev',
      author: 'Miguel Angel',
      url: 'https://midu.dev/',
      likes: 10,
      id: '61fbf3a29337e4076ce5148b'
    }]
    const result = listHelper.mostBlogs(OnlyOneBlog)

    expect(result).toEqual({ author: 'Miguel Angel', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(listHelper.blogList)

    console.log(result)

    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 2 })
  })
})
