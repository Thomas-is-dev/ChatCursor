import { Socket } from 'socket.io-client/build/esm/socket';

declare module '../socket' {
  const socket: any;
  export { socket };
}

declare module 'socket.io-client' {
  const io: any;
  export = io;
} 