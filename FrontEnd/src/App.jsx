// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Profile from "./Pages/Profile.jsx";
import ChatRoom from "./Pages/ChatRoom.jsx"
import Home from "./Pages/Home.jsx";
import Registrar from "./Pages/Register.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SocketProvider from "./Contexts/SocketContext.jsx";
import AuthProvider from "./Contexts/AuthContext.jsx";

function App() {
  
  return (
    <>
      <Router >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<Registrar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<ChatRoom />} />
          </Routes>
        </Router>

    </>
  );
}

export default App;
