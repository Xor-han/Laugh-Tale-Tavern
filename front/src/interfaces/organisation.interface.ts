import type { Crew } from "./equipage.interface";
import type { OnePieceCharacter } from "./onePieceCharacter.interface";

export interface Organisation {
  id: number;
  name: string;
  onePieceCharacters?: OnePieceCharacter[];
  _count?: {
    onePieceCharacter: number;
  };
  image?: {
    url: string;
  }[];
  imageId?: number | null;
  crew?: Crew[];
  content: string;
}

export interface CreateOrg {
  name: string;
  crewIds?: number[];
  imageId?: number | null;
  content: string;
}

export interface OrgUpdate {
  name?: string;
  crewIds?: number[];
  imageId?: number | null;
  content?: string;
}
