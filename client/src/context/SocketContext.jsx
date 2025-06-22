import React, { createContext, useContext, useEffect, useState } from 'react';
import { initSocket, disconnectSocket } from '../utils/socket';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ token, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = initSocket(token);
      setSocket(newSocket);

      return () => {
        disconnectSocket();
        setSocket(null);
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
