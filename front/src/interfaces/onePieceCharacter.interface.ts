import type { Arc } from "./arc.interface";
import type { DevilFruit } from "./devilFruit.interface";
import type { Equipage } from "./equipage.interface";
import type { Organisation } from "./organisation.interface";
import type { ProfessionType } from "./profession.interface";
import type { Image } from "./image.interface";

export interface OnePieceCharacter {
  id: number;
  name: string;
  image?: Image;
  imageId?: string;
  isAlive: boolean;
  imageUrl: string;
  imagePublicId: string;
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
  imageUrl: string;     
  imagePublicId: string; 
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcId?: number | null;
}
export interface CharacterUpdate {
  name?: string;
  isAlive?: boolean;
  imageUrl: string;
  imagePublicId: string;
  profession?: ProfessionType;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcId?: number | null;
}

export interface CharacterFormData {
  name: string;
  profession: ProfessionType;
  isAlive: boolean;
  imageUrl: string;
  imagePublicId: string;
  devilFruit_id?: number | null;
  organisationId?: number | null;
  equipageId?: number | null;
  arcId?: number | null;
}