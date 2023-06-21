import { useState, useEffect } from 'react'
import './chat.css'
import { Avatar, IconButton } from '@mui/material'
import { DonutLarge, MoreVert, InsertEmoticon, MicOutlined } from '@mui/icons-material'
import ChatIcon from '@mui/icons-material/Chat';
import axios from '../axios';

const Chat = ({ messages }) => {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post('/messages/new', {
      message: input,
      name: "DEMO",
      timestamp: "Just now!",
      received: false
    });

    setInput("");
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <Avatar />

        <div className="chat-header-info">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat-header-right">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((message) => (
            <p className={`chat-message ${message.received && "chat-receiver"}`}>
              <span className="chat-name">{message.name}</span>
              {message.message}
              <span className="chat-timestamp">{message.timestamp}</span>
            </p>
          )
        )}
      </div>

      <div className="chat-footer">
        <InsertEmoticon />
        <form>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text" />
          <button onClick={sendMessage} type="submit">Send a message</button>
        </form>
        <MicOutlined />
      </div>
    </div>
  )
}

export default Chat