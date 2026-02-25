import type { OnePieceCharacter } from "./onePieceCharacter.interface";
import type { Type } from "./type.interface";
export interface DevilFruit {
  id: number;
  name: string;
  Image?: string;
  typeId?: number;
  type?: Type;
  onePieceCharacters?: OnePieceCharacter[];
}

export interface CreateFruit {
  name: string;
  Image?: string;
  typeId?: number;
}

export interface FruitUpdate {
  name?: string;
  Image?: string;
  typeId?: number;
}

