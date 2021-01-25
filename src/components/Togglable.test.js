import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Togglable>
        <div className="testDiv" />
      </Togglable>
    )
  })

  test('renders its children', () => {
    expect(
      component.container.querySelector('.testDiv')
    ).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    // component.debug()
    const div = component.container.querySelector('.togglableContent') // searches for an element with this css-class

    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the show button, children are displayed', () => {
    const showButton = component.getByText('show') // search for an element with this text
    // could also search like this (returns the first button found, not recommended if the layout ever changes)
    // const showButton = component.container.querySelector('button') // searches for an element of this type
    expect(showButton).toBeDefined
    
    fireEvent.click(showButton)
    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed by pressing the hide button', () => {
    const showButton = component.getByText('show')
    fireEvent.click(showButton)

    const hideButton = component.getByText('hide')
    // const hideButton = component.container.querySelector('button:nth-child(2)') // returns the second button found
    expect(hideButton).toBeDefined()

    fireEvent.click(hideButton)
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})
