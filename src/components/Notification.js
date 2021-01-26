import React from 'react'

const Notification = ({ message, inlineStyle }) => {
  if (message === null) {
    return null
  }

  return (
    <div id="notification" style={inlineStyle}>
      {message}
    </div>
  )
}

export default Notification