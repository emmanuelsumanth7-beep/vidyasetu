'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the backend socket server
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
      : 'https://bot-api.smha.co.in';
      
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to real-time server');
      
      // Auto-join school room if user is logged in
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.schoolId) {
            newSocket.emit('joinRoom', `school_${user.schoolId}`);
          }
        } catch (e) {
          console.error('Failed to parse user', e);
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
