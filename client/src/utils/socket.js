// src/utils/socket.js
import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token },
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
