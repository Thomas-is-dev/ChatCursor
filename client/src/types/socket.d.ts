declare module 'socket.io-client' {
  import { Socket as SocketType } from 'socket.io-client/build/esm/socket';
  const io: (url: string, opts?: any) => SocketType;
  export default io;
  export type Socket = SocketType;
}

declare module '../socket' {
  import { Socket } from 'socket.io-client';
  export const socket: Socket;
} 