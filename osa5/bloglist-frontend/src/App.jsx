import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    if (user === null) {
      return
    }
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(`loggedBlogappUser`)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message) => {
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem(`loggedBlogappUser`)
    setUser(null)
    blogService.setToken(null)
    setBlogs([])
  }


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(`loggedBlogappUser`, JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('Logged in successfully!')
    } catch {
      showError('Wrong username or password')
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      let returnedBlog = await blogService.create(blogObject)
      returnedBlog = {
        ...returnedBlog,
      }
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      showNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`)
    } catch {
      showError('Failed to create a blog')
    }
  }

  const handleLike = async (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id,
    }

    try {
      const returnedBlog = await blogService.update(
        blogToUpdate.id,
        updatedBlog
      )

      setBlogs(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : { ...returnedBlog, user: blogToUpdate.user }))
    } catch (error) {
      console.error('DID NOT WORK:', error.response?.data || error.message || error)
    }
  }

  const handleRemove = async (blogToRemove) => {
    const confirmDeletion = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`
    )

    if (!confirmDeletion) {
      return
    }

    try {
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
      showNotification(`Blog ${blogToRemove.title} removed successfully`)
    } catch (error) {
      console.error('Failed:', error.response?.data || error.message)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={ ({ target }) => setUsername(target.value) }
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
            type="password"
            value={password}
            onChange = {({ target })=> setPassword(target.value)}
          />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      </div>
    )
  }

  const loggedInView = () => {
    return (
      <div>
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>Logout</button>
          </p>
        </div>

        <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>

        <div>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)}
              handleRemove={() => handleRemove(blog)}
              currentUserId={user.id} />
            )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} className="error" />
      <Notification message={message} className="notification" />
      {!user && loginForm()}
      {user && loggedInView()}
    </div>
  )
}

export default App