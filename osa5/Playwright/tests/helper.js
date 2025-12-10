const loginWith = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Create new blog' }).click()
    await page.getByLabel('title:').fill(title)
    await page.getByLabel('author:').fill(author)
    await page.getByLabel('url:').fill(url)
    await page.getByRole('button', { name: 'Create' }).click()
}

const likeBlog = async (page, blogTitle, count) => {
    const blog = page.getByText(blogTitle)

    await blog.getByRole('button', { name: 'view' }).click()

    for (let i = 0; i < count; i++) {
        await page.getByRole('button', { name: 'Like' }).click()
    }

    await page.getByRole('button', { name: 'hide' }).click()
}

export { loginWith, createBlog, likeBlog }