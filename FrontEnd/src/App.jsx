// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"
import Home from "./Pages/Home";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<Home/> }/>
        </Routes>
      </Router>
    </>

  );
}

export default App;
