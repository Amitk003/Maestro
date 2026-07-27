import { io, Socket } from 'socket.io-client';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    socket = io(WORKER_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};
