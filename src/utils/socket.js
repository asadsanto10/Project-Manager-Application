import { io } from 'socket.io-client';

// create socket
const socket = io(process.env.REACT_APP_API_URL, {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ['websocket'],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

export default socket;
