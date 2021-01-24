import React, { useState, useImperativeHandle } from 'react'

// the function which creates the component is wrapped inside a forwardRef function call
// This way the component can access the ref that is assigned to it
const Togglable = React.forwardRef((props, ref) => { 
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const showButtonLabel = props.showButtonLabel ? props.showButtonLabel : 'show'
  const hideButtonLabel = props.hideButtonLabel ? props.hideButtonLabel : 'hide'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // useImperativeHandle makes the toggleVisibility function available outside this component
  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  // props.children are the elements between the <Togglable> tags
  // for example: <Togglable><p>hello world</p></Togglable>
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{showButtonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{hideButtonLabel}</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable