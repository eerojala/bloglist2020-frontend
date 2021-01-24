import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import BlogView from './BlogView'

const blog = {
  title: 'Title of this blog',
  author: 'Author of this blog',
  url: 'Url of this blog',
  likes: 7,
  user: { name: 'The user who added this blog' }
}

test('renders title and author', () => {
  const component = render(
    <BlogView blog={blog} />
  )

  expect(component.container).toHaveTextContent('Title of this blog')
  expect(component.container).toHaveTextContent('Author of this blog')
  expect(component.container).not.toHaveTextContent('Url of this blog')
  expect(component.container).not.toHaveTextContent('7')
  expect(component.container).not.toHaveTextContent('The user who added this blog')
})