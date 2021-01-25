import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import BlogView from './BlogView'

const blog = {
  title: 'Title of this blog',
  author: 'Author of this blog',
  url: 'Url of this blog',
  likes: 7,
  user: { 
    name: 'The user who added this blog',
    id: 'id'
  }
}

test('renders only title and author by default', () => {
  const component = render(
    <BlogView blog={blog} />
  )

  // component.debug // prints the HTML generated by this component

  // const element = component.getByText('Title of this blog Author of this blog')
  // console.log(prettyDOM(element)) // prints the HTML generated by this specific element

  expect(component.container).toHaveTextContent('Title of this blog')
  expect(component.container).toHaveTextContent('Author of this blog')
  expect(component.container).not.toHaveTextContent('Url of this blog')
  expect(component.container).not.toHaveTextContent('7')
  expect(component.container).not.toHaveTextContent('The user who added this blog')

  // Another way to test content of a component, note that this searches for exact text match, not contains, so we need to search both
  // the title and author at the same time
  // const element = component.getByText('Title of this blog Author of this blog')
  // expect(element).toBeDefined()
})

test('renders other details too after pressing the show button', () => {
  const component = render(
    <BlogView blog={blog} user={{ id: 'id2' }} />
  )

  const showButton = component.getByText('show')
  expect(showButton).toBeDefined()

  fireEvent.click(showButton)
  
  expect(component.container).toHaveTextContent('Title of this blog')
  expect(component.container).toHaveTextContent('Author of this blog')
  expect(component.container).toHaveTextContent('Url of this blog')
  expect(component.container).toHaveTextContent('7')
  expect(component.container).toHaveTextContent('The user who added this blog')
})

test('handleLike is called twice when pressing the like button twice', () => {
  const mockHandler = jest.fn()

  const component = render(
    <BlogView blog={blog} user={{ id: 'id2' }} handleLike={mockHandler}/>
  )

  const showButton = component.getByText('show') // first open the details
  expect(showButton).toBeDefined()
  
  fireEvent.click(showButton)

  const likeButton = component.getByText('Like')
  expect(likeButton).toBeDefined()

  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})