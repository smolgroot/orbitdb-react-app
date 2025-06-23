declare module 'helia' {
  export interface HeliaOptions {
    libp2p?: any;
    start?: boolean;
  }

  export function createHelia(options?: HeliaOptions): Promise<any>;
}

declare module 'libp2p' {
  export interface Libp2pOptions {
    start?: boolean;
    addresses?: {
      listen?: string[];
    };
    transports?: any[];
    connectionEncryption?: any[];
    streamMuxers?: any[];
    services?: any;
  }

  export function createLibp2p(options?: Libp2pOptions): Promise<any>;
}

declare module '@chainsafe/libp2p-noise' {
  export function noise(): any;
}

declare module '@chainsafe/libp2p-yamux' {
  export function yamux(): any;
}

declare module '@libp2p/websockets' {
  export function webSockets(): any;
}

declare module '@libp2p/identify' {
  export function identify(): any;
}

declare module '@libp2p/ping' {
  export function ping(): any;
}
