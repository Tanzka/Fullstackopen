const _ = require('lodash')

const dummy = (blogs) => {
    if (blogs) {
        return 1
    }
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum,blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) =>
        blog.likes > max.likes ? blog : max
    )
}

const mostBlogs = (blogs) => {
    let counts = _.countBy(blogs, 'author')

    const topAuthor = _.maxBy(Object.entries(counts), ([author, count]) => count)

    return {
        author: topAuthor[0],
        blogs: topAuthor[1]
    }
}

const mostLikes = (blogs) => {
    const likesPerAuthor = _.groupBy(blogs, 'author')

    const authorLikes = Object.entries(likesPerAuthor).map(([author, blogs]) => ({
        author,
        likes: _.sumBy(blogs, 'likes')
    }))

    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
