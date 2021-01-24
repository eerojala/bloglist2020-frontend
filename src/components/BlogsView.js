import React from 'react'
import BlogView from './BlogView'

const BlogsView = ({ blogs, handleLike }) => {
  return (
    <div>
      {blogs.map(blog =>
        <BlogView key={blog.id} blog={blog} handleLike={handleLike} />
      )}
    </div>
  )
}

export default BlogsView