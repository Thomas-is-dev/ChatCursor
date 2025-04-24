/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_URL: string
  readonly VITE_SOCKET_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'socket.io-client' {
  export * from '@types/socket.io-client'
} 