import React, { useState, useEffect } from 'react'
// import { useSelector } from 'react-redux';
import './chat.css'
import { Avatar, IconButton } from '@mui/material'
import { DonutLarge, MoreVert, InsertEmoticon, MicOutlined } from '@mui/icons-material'
import ChatIcon from '@mui/icons-material/Chat';
import axios from '../axios';
// import { selectChatRoom } from '../Redux/actions';

const Chat = ({ username, opponent, chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [isSync, setIsSync] = useState(false);
  // const selectedChatRoom = useSelector((state) => state.selectedChatRoom);

  useEffect(() => {
    axios.get('/chatrooms').then((response) => {
      setChatRooms(response.data);
    }).catch((error) => {
      console.log('Error fetching chat rooms:', error);
    });
  }, [isSync]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/messages/sync`);
        const filteredMessages = response.data.filter(
          (message) => message.chatroomId === chatRoomId
        );
        setMessages(filteredMessages);
        setIsSync(!isSync);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [chatRooms, chatRoomId]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post('/messages/new', {
      chatroomId: chatRoomId,
      sender: username,
      message: input,
      timestamp: getCurrentTime(),
      received: false
    });

    setInput("");
    setIsSync(!isSync)
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <Avatar />

        <div className="chat-header-info">
          <h3>{opponent}</h3>
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
          <p className={`chat-message ${message.sender === username ? "" : "chat-receiver"}`}>
            <span className="chat-name">{message.name || message.sender}</span>
            {message.message}
            <span className="chat-timestamp">{message.timestamp}</span>
          </p>
        ))}
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

export default Chat;
