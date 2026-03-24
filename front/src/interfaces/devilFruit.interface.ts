import type { OnePieceCharacter } from "./onePieceCharacter.interface";
export interface DevilFruit {
  hasPage: any;
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
}

export interface CreateFruit {
  name: string;
  typeId?: number | null;
  imageId?: number | null;
}

export interface FruitUpdate {
  name?: string;
  typeId?: number | null;
  imageId?: number | null;
}
