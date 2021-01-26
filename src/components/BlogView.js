import React, { useState } from 'react'

const BlogView = ({ blog, handleLike, handleRemove, user }) => {
  // we do not use <Togglable> because we want the button placement remain fixed in the top row next to the title
  const [showDetails, setShowDetails] = useState(false) 

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeTheBlog = () => {
    // creates a new object with the same values as blog with the exception of the field likes and user
    // we assign only the user id as user because the backend assumes that field user has only the id and is not populated with other data from the user
    handleLike({...blog, likes: blog.likes + 1, user: blog.user.id}) 
  }

  const removeTheBlog = () => {
    handleRemove(blog)
  }

  const details = () => {
    if (!showDetails) {
      return null
    }

    return (
      <div>
        <p>{blog.url}</p>
        <p>
          <span id="likes">{blog.likes}</span>
          <button id="like-button" onClick={likeTheBlog}>Like</button>
        </p>
        <p>{blog.user.name}</p>
        <p>{removeButton()}</p>
      </div>
    )
  }

  const removeButton = () => {
    if (!user.id || !blog.user.id || user.id !== blog.user.id) {
      return null
    }

    return (
      <button id="remove-button" onClick={removeTheBlog}>remove</button>
    )
  }

  return (
    <div id="blog" style={blogStyle}>
      <p>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'show'}</button>
      </p>
      {details()}
    </div>
  )
}

export default BlogView
