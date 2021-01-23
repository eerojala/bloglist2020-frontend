import React, { useState, useEffect } from 'react'
import BlogsView from './components/BlogsView'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      // blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(`login failed with these credentials: username: ${username}, password: ${password}`)
    } 
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const display = () => {
    if (user !== null) {
      return (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in 
            <button onClick={handleLogout}>logout</button>
          </p>
          <BlogsView blogs={blogs} />
        </div>
      )
    } else {
      return (
        <div>
          <h2>Log in to application</h2>
          <LoginForm 
            username={username} 
            handleUsernameChange={({ target }) => setUsername(target.value)} 
            password={password} 
            handlePasswordChange={({ target }) => setPassword(target.value)} 
            handleLogin={handleLogin} 
          />
        </div>
      )
    }
  }

  return (
    <div>
      {display()}
    </div>
  )
}

export default App