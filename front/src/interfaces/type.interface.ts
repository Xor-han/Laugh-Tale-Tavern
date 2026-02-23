export interface Type {
  id: number;
  name: string;
  _count?: { devilFruit: number };
}

export interface TypeUpdate {
  name?: string;
}

export interface CreateType {
  name: string;
}