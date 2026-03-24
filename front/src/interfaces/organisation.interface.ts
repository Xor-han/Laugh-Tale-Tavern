import type { Equipage } from "./equipage.interface";
import type { OnePieceCharacter } from "./onePieceCharacter.interface";

export interface Organisation {
  hasPage: any;
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
  equipage?: Equipage[];
}

export interface CreateOrg {
  name: string;
  equipageIds?: number[];
  imageId?: number | null;
}

export interface OrgUpdate {
  name?: string;
  equipageIds?: number[];
  imageId?: number | null;
}
