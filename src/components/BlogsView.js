import React from 'react'
import BlogView from './BlogView'

const BlogsView = ({ blogs }) => {
  return (
    <div>
      {blogs.map(blog =>
        <BlogView key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default BlogsView