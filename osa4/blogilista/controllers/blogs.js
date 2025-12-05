const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  let result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  result = await result.populate('user', {username: 1, name: 1})

  response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if(blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'wrong user' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', {username: 1, name: 1})
  response.json(result)
})

module.exports = blogsRouter 