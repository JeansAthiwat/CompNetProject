import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client';

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState()

  useEffect(() => {
    return () => {
        if(socket) {
            socket.disconnect();
            setSocket(null)
        }
    };
  });

  return (
    <SocketContext.Provider value={{socket, setSocket}}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
