const { model, Schema } = require('mongoose')

const blogScheama = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
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
