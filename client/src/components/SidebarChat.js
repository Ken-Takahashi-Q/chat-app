import React from 'react'
import './SidebarChat.css'
import { Avatar } from '@mui/material'

const SidebarChat = ({ key, member, onClick }) => {
  const handleClick = () => {
    onClick(member);
  };
  
  return (
    <div className="sidebar-chat" onClick={handleClick}>
      <Avatar />
      <div className="sidebar-chat-info">
        <h2>{member}</h2>
        <p>{member}</p>
      </div>
    </div>
  )
}

export default SidebarChat