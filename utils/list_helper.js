const _ = require('lodash')

const blogList = [
  {
    title: 'midudev',
    author: 'Miguel Angel',
    url: 'https://midu.dev/',
    likes: 10,
    id: '61fbf3a29337e4076ce5148b'
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: '61fc2891554436a78e7dcd71'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    id: '61fc2ada04c0c2b99988e96b'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    id: '61fc2b69908a2cb4700758de'
  }
]

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return likes
}

const favoriteBlog = (blogs) => {
  let favorite = {}

  if (blogs.length) {
    favorite = blogs.reduce((currentMostLikes, blog) => {
      return currentMostLikes.likes > blog.likes
        ? currentMostLikes
        : blog
    }, { likes: 0 })
  }

  return favorite
}

const mostBlogs = (blogs) => {
  const result = {}

  if (blogs.length) {
    const authors = blogs.map(blog => blog.author)

    const largestBlogsAuthor = _.head(_(authors)
      .countBy()
      .entries()
      .maxBy(_.last))

    const recurrence = authors.filter(author => author === largestBlogsAuthor)

    result.author = largestBlogsAuthor
    result.blogs = recurrence.length
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  blogList
}
