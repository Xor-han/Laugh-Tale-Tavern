import type { OnePieceCharacter } from "./onePieceCharacter.interface";

export interface Arc {
  id: number;
  name: string;
  image: string;
  OnePieceCharacter?: OnePieceCharacter[]
}

export interface CreateArc {
  name: string;
  image: string;
}

export interface ArcUpdate {
  name?: string;
  image?: string;
}