import type { Equipage } from "./equipage.interface";
import type { OnePieceCharacter } from "./onePieceCharacter.interface";


export interface Organisation {
  id: number;
  name: string;
  onePieceCharacters?: OnePieceCharacter[];
  _count?: {
    onePieceCharacter : number;
  }
  equipageId?: number;
  equipage?: Equipage;
}

export interface CreateOrg {
  name: string;
  equipageId?: number;
}

export interface OrgUpdate {
  name?: string;
  equipageId?: number;
}