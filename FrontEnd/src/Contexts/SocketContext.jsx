// src/context/SocketContext.jsx
import React, { createContext, useContext, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const connectSocket = (username, avatarIndex) => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:39189", {
        auth: { username, avatarIndex },
      });
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
