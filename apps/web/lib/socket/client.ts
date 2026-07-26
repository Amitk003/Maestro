import { io, Socket } from 'socket.io-client';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:3001';

export const getSocket = (): Socket => {
  return io(WORKER_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
  });
};
