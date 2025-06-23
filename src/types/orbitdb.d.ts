declare module '@orbitdb/core' {
  export interface OrbitDB {
    open(name: string, options?: any): Promise<any>;
    stop(): Promise<void>;
  }

  export interface OrbitDBOptions {
    ipfs: any;
    id?: string;
    directory?: string;
  }

  export function createOrbitDB(options: OrbitDBOptions): Promise<OrbitDB>;
}
