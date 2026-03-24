import type { OnePieceCharacter } from "./onePieceCharacter.interface";
export interface Arc {
  hasPage: any;
  id: number;
  name: string;
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  OnePieceCharacter?: OnePieceCharacter[];
}

export interface CreateArc {
  name: string;
  imageId?: number | null;
}

export interface ArcUpdate {
  name?: string;
  imageId?: number | null;
}
