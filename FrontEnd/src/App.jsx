// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Landing from "./Pages/Landing";
import ChatRoom from "./Pages/ChatRoom.jsx"
import Home from "./Pages/Home.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<ChatRoom />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
