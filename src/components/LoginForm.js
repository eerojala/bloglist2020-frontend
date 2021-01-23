import React from 'react'

const LoginForm = ({ username, handleUsernameChange, password, handlePasswordChange, handleLogin }) => {
  return (
    <div>
      <form onSubmit={handleLogin}>
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