import React, { useState } from 'react'

const BlogView = ({ blog, handleLike }) => {
  // we do not use <Togglable> because we want the button placement remain fixed in the top row next to the title
  const [showDetails, setShowDetails] = useState(false) 

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeTheBlog = (event) => {
    event.preventDefault()
    handleLike({...blog, likes: blog.likes + 1})
  }

  const details = () => {
    if (!showDetails) {
      return null
    }

    return (
      <div>
        <p>{blog.url}</p>
        <p>
          {blog.likes}
          <button onClick={likeTheBlog}>Like</button>
        </p>
        <p>{blog.author}</p>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} 
        <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'show'}</button>
      </p>
      {details()}
    </div>
  )
}

export default BlogView
