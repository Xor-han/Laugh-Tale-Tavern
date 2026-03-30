import type { OnePieceCharacter } from "./onePieceCharacter.interface";
import type { Organisation } from "./organisation.interface";

export interface Crew {
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
  organisation?: Organisation[];
  content: string;
}

export interface CreateCrew {
  name: string;
  imageId?: number | null;
  organisationIds?: number[];
  content: string;
}

export interface CrewUpdate {
  name?: string;
  imageId?: number | null;
  organisationIds?: number[];
  content: string;
}
