const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'The wonders of unit testing',
        author: 'Luke Skywalker',
        url: 'https://www.spaghettimonster.org/',
        likes: 5
    },
    {
        title: 'Why democracy actually sucks',
        author: 'Palpatine',
        url: 'https://www.sithchurch.org/',
        likes: 1
    },
    {
        title: 'Write unit tests you must',
        author: 'Yoda',
        url: 'https://www.iwillcry.net',
        likes: 7
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
}