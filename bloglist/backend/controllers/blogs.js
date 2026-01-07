const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate) {
    return response.status(404).end()
  }

  const fields = ['title', 'author', 'url', 'likes']
  fields.forEach(field => {
    if (request.body[field] !== undefined)
      blogToUpdate[field] = request.body[field]
  })

  const updatedBlog = await blogToUpdate.save()
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter