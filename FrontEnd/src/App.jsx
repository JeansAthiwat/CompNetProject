// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Landing from "./Pages/Landing";

function App() {
  return (
    <Router>
      <h2>test</h2>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatRoom roomId={0} />} />
      </Routes>
    </Router>
  );
}

export default App;
