import React from 'react'
const BlogView = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
)

export default BlogView
