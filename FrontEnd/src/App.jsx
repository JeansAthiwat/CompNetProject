// App.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Initialize the socket connection.
// Replace "http://localhost:5000" with the URL of your Socket.IO server.
const socket = io("http://localhost:5000");

function App() {
  // State to hold the current input message and the list of received messages.
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for messages from the server on component mount.
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup listener on component unmount.
    return () => {
      socket.off("chat message");
    };
  }, []);

  // Function to send a new chat message.
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Emit the message to the server.
      socket.emit("chat message", message);
      // Optionally, you can update the UI immediately by appending the message.
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <header>
        <h2>React Chatbox</h2>
      </header>
      <main>
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              autoFocus
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
