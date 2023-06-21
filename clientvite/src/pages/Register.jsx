import { useState } from 'react';
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

  const { username, email, password } = form;

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('/register', form);
      setNotifyMessage(res.data.message + ". Redirecting to Login")
      setNotify(true);
      setTimeout(() => {
        setNotify(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.log(error);
      setNotifyMessage(error.message)
      setNotify(true);
      setTimeout(() => {
        setNotify(false);
      }, 2000);
    }
  };

  return (
    <div className="register">
      {/* <Navbar/> */}
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

        <div className={`notification ${!notify && "hidden"} ${notifyMessage === "User registered successfully" ? "success" : "fail"}`}>
          {notifyMessage === "User registered successfully" ? <CheckCircle className="icon" /> : <Cancel className="icon" />}
          {notifyMessage || "Error"}
        </div>
      </div>
    </div>
  );
};

export default Register;
