import type { Arc } from "./arc.interface";
import type { DevilFruit } from "./devilFruit.interface";
import type { Equipage } from "./equipage.interface";
import type { Organisation } from "./organisation.interface";
import type { ProfessionType } from "./profession.interface";

export interface OnePieceCharacter {
  id: number;
  name: string;
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  isAlive: boolean;
  profession: ProfessionType;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcId?: number | null;
  devilFruit?: DevilFruit;
  organisation?: Organisation;
  equipage?: Equipage;
  arc?: Arc;
}

export interface CreateCharacter {
  name: string;
  isAlive: boolean;
  profession: ProfessionType;
  imageId?: number | null;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcId?: number | null;
}
export interface CharacterUpdate {
  name?: string;
  isAlive?: boolean;
  profession?: ProfessionType;
  imageId?: number | null;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcId?: number | null;
}
