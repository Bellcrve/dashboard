'use client';
import React, { createContext, useContext, useState, useRef } from 'react';

interface WebSocketContextProps {
  connect: (url: string) => Promise<void>;
  send: (data: any) => void;
  disconnect: () => void;
  isConnected: boolean;
  subscribe: (callback: (data: any) => void) => void;
  unsubscribe: (callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  connect: async () => {},
  send: () => {},
  disconnect: () => {},
  isConnected: false,
  subscribe: () => {},
  unsubscribe: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribers = useRef<Set<(data: any) => void>>(new Set());
  const connectionPromise = useRef<{
    resolve: () => void;
    reject: (reason?: any) => void;
  } | null>(null);

  const connect = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (ws.current) {
        console.log('WebSocket is already connected');
        resolve();
        return;
      }

      console.log(`Attempting to connect to WebSocket at ${url}`);
      ws.current = new WebSocket(url);

      connectionPromise.current = { resolve, reject };

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        connectionPromise.current?.resolve();
        connectionPromise.current = null;
      };

      ws.current.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          subscribers.current.forEach((callback) => callback(data));
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.reason);
        setIsConnected(false);
        ws.current = null;
        connectionPromise.current?.reject(new Error('WebSocket disconnected'));
        connectionPromise.current = null;
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        connectionPromise.current?.reject(error);
        connectionPromise.current = null;
      };
    });
  };

  const send = (data: any) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(data));
      console.log('Sent data:', data);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);
      console.log('WebSocket connection closed by client');
    }
  };

  const subscribe = (callback: (data: any) => void) => {
    subscribers.current.add(callback);
  };

  const unsubscribe = (callback: (data: any) => void) => {
    subscribers.current.delete(callback);
  };

  return (
    <WebSocketContext.Provider
      value={{ connect, send, disconnect, isConnected, subscribe, unsubscribe }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
