import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
    const blog = {
        title: 'testblog',
        author: 'author',
        url: 'url',
        likes: 3,
        user: {
            name: 'name'
        }
    }

    const blogUser = {
        username: 'user',
        name: 'name'
    }

    const handleLike = vi.fn()

    let container

    beforeEach(() => {
        container = render(<Blog blog={blog} handleLike={handleLike} user={blogUser} />).container
    })

    test('Renders title', () => {
        const element = screen.getByText('testblog', { exact: false })
        expect(element).toBeDefined()
    })

    test('Extra information is hidden by default', () => {
        const minimalContent = screen.getByText('testblog author', { exact: false })
        expect(minimalContent).toBeDefined()

        const urlElement = screen.queryByText('URL: url')
        expect(urlElement).toBeNull()

        const likesElement = screen.queryByText('likes: 3')
        expect(likesElement).toBeNull()

        const likeButton = screen.queryByText('Like')
        expect(likeButton).toBeNull()
    })

    test('Extra information is displayed on button click', async () => {
        const user = userEvent.setup()

        const viewButton = screen.getByRole('button', { name: 'view' })

        await user.click(viewButton)

        const hideButton = screen.getByRole('button', { name: 'hide' })
        expect(hideButton).toBeDefined()

        const urlElement = screen.getByText('URL: url')
        expect(urlElement).toBeDefined()

        const likesElement = screen.getByText('likes: 3', { exact: false })
        expect(likesElement).toBeDefined()

        const likeButton = screen.getByRole('button', { name: 'Like' })
        expect(likeButton).toBeDefined()
    })

    test('Like function is called twice when clicked twice', async () => {
        const user = userEvent.setup()

        const viewButton = screen.getByRole('button', { name: 'view' })
        await user.click(viewButton)

        const likeButton = screen.getByRole('button', { name: 'Like' })

        await user.click(likeButton)
        await user.click(likeButton)

        expect(handleLike.mock.calls).toHaveLength(2)
    })
})