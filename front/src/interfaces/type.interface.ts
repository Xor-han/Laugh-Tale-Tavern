import type { DevilFruit } from "./devilFruit.interface";

export interface Type {
  id: number;
  name: string;
  devilFruits?: DevilFruit[];
  _count?: { devilFruit: number };
}

export interface TypeUpdate {
  name?: string;
}

export interface CreateType {
  name: string;
}
