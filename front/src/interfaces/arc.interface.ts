import type { OnePieceCharacter } from "./onePieceCharacter.interface";
import type { Image } from "./image.interface";
export interface Arc {
  id: number;
  name: string;
  image?: Image;
  imageId?: string;
  OnePieceCharacter?: OnePieceCharacter[];
}

export interface CreateArc {
  name: string;
  imageId?: string;
}

export interface ArcUpdate {
  name?: string;
  imageId?: string;
}
