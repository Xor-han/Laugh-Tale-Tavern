import type { OnePieceCharacter } from "./onePieceCharacter.interface";
import type { Type } from "./type.interface";
import type {Image} from "./image.interface"
export interface DevilFruit {
  id: number;
  name: string;
  image?: Image ;
  imageId?: string;
  typeId?: number;
  type?: Type;
  onePieceCharacters?: OnePieceCharacter[];
}

export interface CreateFruit {
  name: string;
  imageId?: string;
  typeId?: number;
}

export interface FruitUpdate {
  name?: string;
  imageId?: string;
  typeId?: number;
}

export interface FruitFormData {
  name: string;
  typeId: number;
  imageUrl: string;
  imagePublicId: string;
}