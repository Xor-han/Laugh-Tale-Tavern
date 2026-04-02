import type { Arc } from "./arc.interface";
import type { DevilFruit } from "./devilFruit.interface";
import type { Crew } from "./equipage.interface";
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
  devilFruitId?: number | null;
  organisationId?: number | null;
  crewId?: number | null;
  devilFruit?: DevilFruit;
  organisation?: Organisation;
  crew?: Crew;
  arcs?: Arc[];
  content: string;
}

export interface CreateCharacter {
  name: string;
  isAlive: boolean;
  profession: string;
  imageId?: number | null;
  devilFruitId?: number | null;
  organisationId?: number | null;
  crewId?: number | null;
  arcIds?: number[];
  content: string;
}
export interface CharacterUpdate {
  name?: string;
  isAlive?: boolean;
  profession?: string;
  imageId?: number | null;
  devilFruitId?: number | null;
  organisationId?: number | null;
  crewId?: number | null;
  arcIds?: number[];
  content: string;
}
