const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('Blogs are returned as JSON', async () => {
  console.log('Testing JSON blogs')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('All blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(helper.initialBlogs.length, response.body.length)
})

test('A valid blog can be posted', async () => {
  const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('First class tests'))
})

test('Blog without title, author, or url not added', async () => {
  const missingTitle = {
    author: 'Thomas Girardet',
    url: 'http://blog.nah.com/tired-and-working.html',
    likes: 5,
  }

  const missingAuthor = {
    title: 'Tired but Still Working',
    url: 'http://blog.nah.com/tired-and-working.html',
    likes: 5,
  }

  const missingURL = {
    author: 'Thomas Girardet',
    title: 'Tired but Still Working',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(missingTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(missingAuthor)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(missingURL)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('Blogs with id property instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log(response.body)

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('Blogs with likes missing default to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Test Author',
    url: 'http://example.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

describe('Deletion of a blog', () => {
  test('Succeeds with status code 204 is id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(blog => blog.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)
  })
})

describe('Updating of a blog', () => {
  test.only('Successful update of likes returns status 200', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    console.log(blogToUpdate)

    const updatedBlog = {
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    const blogsAtEnd = await helper.blogsInDb()
    const modifiedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    console.log(modifiedBlog)

    assert.strictEqual(modifiedBlog.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  mongoose.connection.close()
})