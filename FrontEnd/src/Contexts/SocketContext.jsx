// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token ) return;
    console.log(socket);
    const newSocket = io("http://localhost:39189", {
      auth: {
        token,
        displayName: user?.displayName,
        avatarIndex: user?.avatarIndex,
      },
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected:", newSocket.id);
      // console.log(user)
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token, user?.displayName, user?.avatarIndex]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
