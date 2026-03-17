import type { OnePieceCharacter } from "./onePieceCharacter.interface";

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
}

export interface CreateEquipage {
  name: string;
  imageId?: number | null;
}

export interface EquipageUpdate {
  name?: string;
  imageId?: number | null;
}
