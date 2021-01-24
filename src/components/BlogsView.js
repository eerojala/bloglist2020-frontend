import React from 'react'
import BlogView from './BlogView'

const BlogsView = ({ blogs, handleLike, handleRemove, user }) => {
  return (
    <div>
      {blogs.map(blog =>
        <BlogView 
          key={blog.id} 
          blog={blog} 
          user={user}
          handleLike={handleLike} 
          handleRemove={handleRemove} 
        />
      )}
    </div>
  )
}

export default BlogsView