const { model, Schema } = require('mongoose')

const blogScheama = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  }
})

/**
 *  Aca seteamos la forma del objeto justo antes de ser devuelto
 *  Es decir, en esta linea de express:
 *  ->           res.json(contacts)
 */
blogScheama.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = model('Blog', blogScheama)

module.exports = Blog
