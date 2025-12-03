import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

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

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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

  const handleCreateBlog = async event => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      showNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`)
    } catch {
      showError('Failed to create a blog')
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

  const blogForm = () => (
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

        {blogForm()}

        <div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
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