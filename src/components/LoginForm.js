import React from 'react'

const LoginForm = ({ username, handleUsernameChange, password, handlePasswordChange, handleSubmit }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username <input type="text" value={username} name="Username" onChange={handleUsernameChange} />
        </div>
        <div>
          password <input type="password" value={password} name="Passwosrd" onChange={handlePasswordChange} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm