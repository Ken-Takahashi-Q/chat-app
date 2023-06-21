import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import './App.css';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import axios from './axios';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const savedUsername = localStorage.getItem('username');
    if (userToken) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  // Chat page
  useEffect(() => {
    if (isLoggedIn) {
      axios.get('/messages/sync').then((res) => {
        setMessages(res.data)
      })
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const pusher = new Pusher('70275e031e7ebbf7f513', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      console.log(newMessage)
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
    setUsername(username);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navbar onLogout={handleLogout} />
      <div className="app-body">
        <Sidebar username={username} />
        <Chat username={username} messages={messages} />
      </div>
    </div>
  );
}

export default App;
