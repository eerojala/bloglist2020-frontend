import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleSubmit({ 
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          Title: <input id="title" type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author: <input id="author" type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          URL: <input id="url" type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <div>
          <button id="create-button" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default BlogForm