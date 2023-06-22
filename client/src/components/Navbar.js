import React from 'react'
import './navbar.css'

const Navbar = ({ onLogout, isLoggedIn }) => {
  return (
    <div className="navbar">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        {isLoggedIn && (
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
        )}
      </ul>
    </div>
  )
}

export default Navbar