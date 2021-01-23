import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import BlogsView from './components/BlogsView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const baseStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const successStyle = {...baseStyle, color: "green"}
  const errorStyle = {...baseStyle, color: "red"}

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(baseStyle)

  // second parameter's empty array means that this hook is run only after the first render is done (not on subsequent renders)
  // so first the component is rendered without the blogs
  // but after the blogs are successfully fetched and the state is updated, the component is rerendered 
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')

    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      blogService.setToken(user.token) // set the user token for use in the authorization header in HTTP requests
      setUser(user) 
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      displaySuccessNotification('Successfully added a new blog!')
    } catch (exception) {
      displayErrorNotification(exception)
    }
  }

  const displaySuccessNotification = (message) => {
    setNotification(message)
    setNotificationStyle(successStyle)
    setNotificationTimeout(5000)
  }

  const displayErrorNotification = (exception) => {
    setNotification(exception.response.data.error)
    setNotificationStyle(errorStyle)
    setNotificationTimeout(8000)
  }

  const setNotificationTimeout = (time) => {
    setTimeout(() => { setNotification(null) }, time) // After {time} milliseconds, the notification is nullified (so it does not render anymore)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      displaySuccessNotification(`Successfully logged in as ${user.username}`)
    } catch (exception) {
      displayErrorNotification(exception)
    } 
  }

  const handleLogout = () => {
    displaySuccessNotification(`Successfully logged out user ${user.name}`)
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
          <Togglable buttonLabel='new blog'>
            <h2>Create new</h2>
            <BlogForm handleSubmit={addBlog}/>
          </Togglable>
          <BlogsView blogs={blogs} />
        </div>
      )
    } else {
      return (
        <div>
          <h2>Log in to application</h2>
          <LoginForm handleSubmit={handleLogin} />
        </div>
      )
    }
  }

  return (
    <div>
      <Notification message={notification} inlineStyle={notificationStyle} />
      {display()}
    </div>
  )
}

export default App