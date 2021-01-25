import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('updates parents state and calls onSubmit', () => {
    const createBlog = jest.fn()

    const component = render(
      <BlogForm handleSubmit={createBlog} />
    )

    const titleInput = component.container.querySelector('#title') // searches for an element with this id
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form') // searches for a form element
    expect(titleInput).toBeDefined()
    expect(authorInput).toBeDefined()
    expect(urlInput).toBeDefined()
    expect(form).toBeDefined()

    // change the inputs:
    fireEvent.change(titleInput, {
      target: { value: 'This is a title' }
    })
    fireEvent.change(authorInput, {
      target: { value: 'Written by' }
    })
    fireEvent.change(urlInput, {
      target: { value: 'localhost:3000' }
    })

    // submit the form values:
    fireEvent.submit(form)
    
    const mockCalls = createBlog.mock.calls
    expect(mockCalls).toHaveLength(1)
    expect(mockCalls[0][0].title).toBe('This is a title')
    expect(mockCalls[0][0].author).toBe('Written by')
    expect(mockCalls[0][0].url).toBe('localhost:3000')
  })
})