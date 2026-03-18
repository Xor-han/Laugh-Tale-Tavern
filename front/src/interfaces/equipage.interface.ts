import type { OnePieceCharacter } from "./onePieceCharacter.interface";
import type { Organisation } from "./organisation.interface";

export interface Equipage {
  id: number;
  name: string;
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  onePieceCharacters?: OnePieceCharacter[];
  _count?: {
    onePieceCharacter: number;
  };
  organisation?: Organisation[];
}

export interface CreateEquipage {
  name: string;
  imageId?: number | null;
  organisationIds?: number[];
}

export interface EquipageUpdate {
  name?: string;
  imageId?: number | null;
  organisationIds?: number[];
}
