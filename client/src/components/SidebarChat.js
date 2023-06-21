import React from 'react'
import './SidebarChat.css'
import { Avatar } from '@mui/material'

const SidebarChat = () => {
  return (
    <div className="sidebar-chat">
      <Avatar />
      <div className="sidebar-chat-info">
        <h2>Room name</h2>
        <p>Last chats</p>
      </div>
    </div>
  )
}

export default SidebarChat