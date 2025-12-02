import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (user === null) {
      return
    }
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [user])


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in</p>
        </div>
      )}

      <div>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    </div>
  )
}

export default App