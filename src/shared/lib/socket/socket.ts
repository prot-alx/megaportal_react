import { io, Socket } from 'socket.io-client';
import { baseURL } from '@/shared/constants';

export const createSocket = (): Socket => {
  const socket = io(baseURL, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'],
    auth: {
      headers: {
        Cookie: document.cookie
      }
    }
  });

  socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
  });

  socket.on('test', (data) => {
    console.log('Received test message:', data);
  });

  socket.on('changes', (message) => {
    console.log('Received changes:', message);
  });

  socket.on('heartbeat', () => {
    console.log('Heartbeat received');
    socket.emit('heartbeat');
  });

  socket.on('ping', () => {
    console.log('Ping received');
  });

  socket.on('pong', (latency) => {
    console.log('Pong received, latency:', latency, 'ms');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected, reason:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};