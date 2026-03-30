import type { OnePieceCharacter } from "./onePieceCharacter.interface";
export interface Arc {
  id: number;
  name: string;
  content: string;
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  OnePieceCharacter?: OnePieceCharacter[];
}

export interface CreateArc {
  name: string;
  imageId?: number | null;
  content: string;
}

export interface ArcUpdate {
  name?: string;
  imageId?: number | null;
  content?: string;
}
