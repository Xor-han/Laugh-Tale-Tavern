import type { OnePieceCharacter } from "./onePieceCharacter.interface";
export interface DevilFruit {
  id: number;
  name: string;
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  typeId?: number | null;
  type?: {
    name: string;
  };
  onePieceCharacters?: OnePieceCharacter[];
  content: string;
}

export interface CreateFruit {
  name: string;
  typeId?: number | null;
  imageId?: number | null;
  content: string;
}

export interface FruitUpdate {
  name?: string;
  typeId?: number | null;
  imageId?: number | null;
  content?: string;
}
