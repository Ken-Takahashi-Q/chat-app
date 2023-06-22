import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import axios from '../axios';
import { CheckCircle, Cancel } from '@mui/icons-material';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { username, email, password } = form;

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('/register', form);
      setSuccess(true);
      setNotifyMessage("Register Successful. Redirecting to Login")
      setNotify(true);
      setTimeout(() => {
        setNotify(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setNotifyMessage(error.response.data)
      setNotify(true);
      setTimeout(() => {
        setNotify(false);
      }, 2000);
    }
  };

  return (
    <div className="register">
      <Navbar/>
      <div className="register-page">
        <div className="register-card">
          <h1>Register</h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
          />
          <span className="divider"></span>
          <button onClick={handleRegister} className="button-primary">
            Register
          </button>
        </div>

        <div className={`notification ${!notify && "hidden"} ${success ? "success" : "fail"}`}>
          {success ? <CheckCircle className="icon" /> : <Cancel className="icon" />}
          {notifyMessage || "Error"}
        </div>
      </div>
    </div>
  );
};

export default Register;
