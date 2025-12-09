import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Creating a blog sends the correct information', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const title = 'Testing Form Creation'
    const author = 'John Doe'
    const url = 'www.testing.idk'

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const createButton = screen.getByRole('button', { name: 'Create' })

    await user.type(titleInput, title)
    await user.type(authorInput, author)
    await user.type(urlInput, url)

    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0]).toEqual({
        title: title,
        author: author,
        url: url
    })
})