const assert = require('node:assert')
const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let authorization

before(async () => {
    console.log('im in.jpg')
    await User.deleteMany({})
    const user = {
        username: 'root',
        password: 'sekret'
    }

    await api.post('/api/users').send(user)

    const response = await api 
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
    
    authorization = `Bearer ${response.body.token}`
})


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, blogsAtStart.length)
})

test('all blogs have id parameter', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert.ok(blog.id, 'expect blog to have id property')
    })
})

test('a new blog can be added with valid token', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
        title: 'New Blog Test',
        author: 'Test Testerson',
        url: 'http://wearetesting.com',
        likes: 10
    }

    await api 
        .post('/api/blogs')
        .set({'Authorization': authorization})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('New Blog Test'))
})

test('likes default to zero if no value given', async () => {
    const newBlog = {
        title: 'We Are Testing For Likes',
        author: 'Does not matter',
        url: 'http://iwishtoscream.fi'
    }

    const sentBlog = await api 
        .post('/api/blogs')
        .set({'Authorization': authorization})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(sentBlog.body.likes, 0)
})

test('returns status 400 if title not given', async () => {
    const newBlog = {
        author: 'Billy Joel',
        url: 'http://asdf.com',
        likes: 4
    }

    const blogsAtStart = await helper.blogsInDb()

    await api 
        .post('/api/blogs')
        .set({'Authorization': authorization})
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('returns 400 if url not given', async () => {
        const newBlog = {
        title: 'Testing for url',
        author: 'Billy Joel',
        likes: 4
    }

    const blogsAtStart = await helper.blogsInDb()

    await api 
        .post('/api/blogs')
        .set({'Authorization': authorization})
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('a blog can be deleted with valid token', async () => {
    const newBlog = {
        title: 'Deleting this',
        author: 'Guy Fieri',
        url: 'http://delete.this',
        likes: 25
    }

    const createdBlog = await api
        .post('/api/blogs')
        .set({ 'Authorization': authorization })
        .send(newBlog)
        .expect(201)
    
    const blogsAtStart = await helper.blogsInDb()

    await api 
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set({ 'Authorization': authorization })
        .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    assert.ok(!ids.includes(createdBlog.body.id))
})

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        title: "womp womp",
        author: "Peter Griffin",
        url: "http://beep.boop",
        likes: 15
    }

    await api 
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)
})

test('returns a 401 if there is no token', async () => {
    const newBlog = {
        title: "werp",
        author: "herp",
        url: "derp.derp",
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    
    const response = await api 
        .get('/api/blogs')
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})