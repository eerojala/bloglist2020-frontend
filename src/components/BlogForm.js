import React from 'react'

const BlogForm = ({ title, handleTitleChange, author, handleAuthorChange, url, handleUrlChange, submit }) => {
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          Title: <input type="text" value={title} name="Title" onChange={handleTitleChange} />
        </div>
        <div>
          Author: <input type="text" value={author} name="Author" onChange={handleAuthorChange} />
        </div>
        <div>
          URL: <input type="text" value={url} name="Url" onChange={handleUrlChange} />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm