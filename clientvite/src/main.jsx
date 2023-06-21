import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
// import Login from './pages/Login';
// import Register from './pages/Register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        {/* <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
