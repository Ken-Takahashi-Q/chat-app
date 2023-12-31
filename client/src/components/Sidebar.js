import React, { useState, useRef, useEffect } from 'react';
import './sidebar.css';
import { SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SidebarChat from './SidebarChat';
import axios from '../axios';
import Chat from './Chat';

const Sidebar = ({ username }) => {
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    axios.get('/chatrooms').then((response) => {
      setChatRooms(response.data);
    }).catch((error) => {
      console.log('Error fetching chat rooms:', error);
    });
  }, []);

  const userChatRooms = chatRooms.filter(
    (room) => room.member === username || room.creater === username
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        const filterOption = response.data.filter((option) => option.username !== username)
        setOptions(filterOption);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchValue(searchValue);
    setIsDropdownOpen(true);
  
    const filteredOptions = options.filter((option) =>
      option.username.toLowerCase().includes(searchValue.toLowerCase())
    );
  
    setFilteredOptions(filteredOptions);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setFilteredOptions(options)
  };

  const handleDropdownItemClick = (option) => {
    setSearchValue(option.username);
    setIsDropdownOpen(false);
  };

  const handleCreateRoom = async () => {
    if (username && searchValue) {
      try {
        const response = await axios.post('/chatrooms', {
          creater: username,
          member: searchValue,
        });
        const newChatRoom = response.data;
  
        console.log('New chat room created:', newChatRoom);
      } catch (error) {
        console.error('Error creating chat room:', error);
      }
    }
  }

  const handleChatRoomClick = (room) => {
    setSelectedChatRoom(room);
    setShowChat(true) 
  };

  return (
    <div className="sidebar">
      <div className="sidebar-left">
        <div className="sidebar-header">
          <img src="/logo192.png" alt="profile" />
          <div className="sidebar-header-right">{username}</div>
        </div>

        <div className="sidebar-search">
          <div className="sidebar-search-container">
            <SearchOutlined />
            <input
              ref={searchInputRef}
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleDropdownToggle}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              placeholder="Search or start new chat"
              type="text"
            />
          </div>
          <button className="button-primary" onClick={handleCreateRoom}>Add</button>
          {isDropdownOpen && (
            <div className="search-dropdown">
              {filteredOptions.map((option) => (
                <div
                  key={option.email}
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick(option)}
                >
                  {option.username}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-chats">
          {userChatRooms.map((room) => (
            <SidebarChat
              key={room.chatroom}
              member={room.member}
              onClick={(room) => handleChatRoomClick(room)}
            />
          ))}
        </div>
      </div>
      {/* {showChat && <Chat username={selectedChatRoom} />}   */}
    </div>
  );
};

export default Sidebar;
