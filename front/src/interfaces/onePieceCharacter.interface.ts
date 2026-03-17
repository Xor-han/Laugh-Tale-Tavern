import type { Arc } from "./arc.interface";
import type { DevilFruit } from "./devilFruit.interface";
import type { Equipage } from "./equipage.interface";
import type { Organisation } from "./organisation.interface";

export interface OnePieceCharacter {
  id: number;
  name: string;
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  isAlive: boolean;
  profession: string;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  devilFruit?: DevilFruit;
  organisation?: Organisation;
  equipage?: Equipage;
  arcs?: Arc[];
}

export interface CreateCharacter {
  name: string;
  isAlive: boolean;
  profession: string;
  imageId?: number | null;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcIds?: number[];
}
export interface CharacterUpdate {
  name?: string;
  isAlive?: boolean;
  profession?: string;
  imageId?: number | null;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcIds?: number[];
}
