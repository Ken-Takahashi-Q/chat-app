import React from 'react'
import './navbar.css'

const Navbar = ({ onLogout }) => {
  return (
    <div className="navbar">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default Navbar