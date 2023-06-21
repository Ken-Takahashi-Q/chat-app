import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from '../axios';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const { email, password } = form;

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('/login', form);
      const { token, username } = res.data;
      onLogin(token, username);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <input type="text" name="email" placeholder="Email" value={email} onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} />
        <span className="divider"></span>

        <button onClick={handleLogin} className="button-primary">Login</button>
        <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;
