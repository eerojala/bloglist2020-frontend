import React, { useState, useEffect, useRef } from 'react'
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

  // create a ref which we can use as a reference to a child component to access it's functions 
  // (this is later passed to Toggable below)
  // This hook ensures that the same reference (ref) is kepth throughout re-renders of this component
  const blogFormRef = useRef() 

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

      returnedBlog.user = user // the returned blog is not populated with the user's data
      setBlogs(blogs.concat(returnedBlog))
      displaySuccessNotification('Successfully added a new blog!')
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log('exception')
      displayErrorNotification('Failed to add new blog')
    }
  }

  const updateBlog = async (blog) => {
    console.log(blog)
    try {
      const updatedBlog = await blogService.update(blog)

      // replace the old blog with the updated blog without affecting the order of the blogs
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b)) 
    } catch (exception) {
      displayErrorNotification('Blog has been removed from the database after rendering this site. Removing blog...')
      setBlogs(blogs.filter(b => b.id !== blog.id ))
    }
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
        await blogService.remove(blog.id)

        setBlogs(blogs.filter(b => b.id !== blog.id ))
      }
    } catch (exception) {
      displayErrorNotification('blog already removed from database')
      setBlogs(blogs.filter(b => b.id !== blog.id ))
    }
  }

  const displaySuccessNotification = (message) => {
    setNotification(message)
    setNotificationStyle(successStyle)
    setNotificationTimeout(5000)
  }

  const displayErrorNotification = (message) => {
    setNotification(message)
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
      displayErrorNotification(exception.response.data.error)
    } 
  }

  const handleLogout = () => {
    displaySuccessNotification(`Successfully logged out user ${user.name}`)
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  let sortedBlogs = blogs.concat() // first we copy the blogs because the sort is done in-place and we don't want to affect the original array
  sortedBlogs.sort((a, b) => b.likes - a.likes) // then we sort the copy based on the number of likes


  const display = () => {
    if (user !== null) {
      return (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in 
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable showButtonLabel='Add a new blog' hideButtonLabel='cancel' ref={blogFormRef}> 
            <h2>Create new</h2>
            <BlogForm handleSubmit={addBlog}/>
          </Togglable>
          <BlogsView 
            blogs={sortedBlogs} 
            user={user}
            handleLike={updateBlog}
            handleRemove={removeBlog}
          />
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