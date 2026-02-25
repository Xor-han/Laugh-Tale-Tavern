import type { OnePieceCharacter } from "./onePieceCharacter.interface";

export interface Equipage {
  id: number;
  name: string;
  onePieceCharacters?: OnePieceCharacter[];
  _count?: {
    onePieceCharacter : number;
  }
}

export interface CreateEquipage {
  name: string;
}

export interface EquipageUpdate {
  name?: string;
}