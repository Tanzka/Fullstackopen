import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const handleCreateBlog = (event) => {
        event.preventDefault()

        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }

    return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            title:
            <input
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm 