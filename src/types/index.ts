export type OrbitDBData = {
  id: string;
  content: string;
  timestamp: number;
};

export interface OrbitDBOptions {
  directory?: string;
  create?: boolean;
  overwrite?: boolean;
}

export type OrbitDBEvent = {
  eventType: 'added' | 'updated' | 'removed';
  data: OrbitDBData;
};