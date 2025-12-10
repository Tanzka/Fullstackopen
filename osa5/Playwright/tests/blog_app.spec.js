const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Bloglist', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            loginWith(page, 'mluukkai', 'salainen')

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            loginWith(page, 'mluukkai', 'wrong')

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('Wrong username or password')
        })
    })

    describe('When logged in', () => {
        beforeEach(({ page }) => {
            loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Test blog', 'Test Author', 'notareal.url')

            await expect(page.getByText('Test blog Test Author')).toBeVisible()
        })

        test('blog can be liked', async ({ page }) => {
            await createBlog(page, 'Test blog', 'Test Author', 'notareal.url')
            await likeBlog(page, 'Test Blog', 1)

            const blog = page.getByText('Test blog Test Author')
            await blog.getByRole('button', { name: 'view' }).click()
            await expect(page.getByText('1')).toBeVisible()
        })

        test('a blog can be deleted', async ({ page }) => {
            page.on('dialog', dialog => dialog.accept())
            await createBlog(page, 'Test blog', 'Test Author', 'notareal.url')

            const blog = page.getByText('Test blog Test Author')
            await blog.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'Remove' }).click()
            await expect(page.getByText('Test blog Test Author')).not.toBeVisible()
        })

        test('blog can only be deleted by creator', async ({ page, request }) => {
            await createBlog(page, 'Test blog', 'Test Author', 'notareal.url')

            const blog = page.getByText('Test blog Test Author')
            await blog.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()
            await page.getByRole('button', { name: 'Logout' }).click()

            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Test Tester',
                    username: 'Testinger',
                    password: 'wordpass'
                }
            })
            await loginWith(page, 'Testinger', 'wordpass')
            await blog.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
        })

        test('blogs are sorted in order of likes, most to least', async({ page }) => {
            await createBlog(page, 'Unpopular Blog', 'User A', 'url.a')

            await createBlog(page, 'Most Popular Blog', 'User B', 'url.b')
            await likeBlog(page, 'Most Popular Blog', 5)

            await createBlog(page, 'Second Popular Blog', 'User C', 'url.c')
            await likeBlog(page, 'Second Popular Blog', 3)

            const blogs = page.locator('.blog')
            await expect(blogs.first()).toContainText('Most Popular Blog User B')
            await expect(blogs.nth(1)).toContainText('Second Popular Blog User C')
            await expect(blogs.last()).toContainText('Unpopular Blog User A')
        })
    })
})