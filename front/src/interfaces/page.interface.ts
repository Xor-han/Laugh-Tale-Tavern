import type { Arc } from "./arc.interface";
import type { Comment } from "./comment.interface";
import type { DevilFruit } from "./devilFruit.interface";
import type { OnePieceCharacter } from "./onePieceCharacter.interface";
import type { Organisation } from "./organisation.interface";

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  createdAt : string;
  comments?: Comment[];
  entityId?: number;
  entityType?: string;
  
}

export interface PageUpdate {
  slug?: string;
  content: string;
  entityId?: number;
  entityType?: string;
}

export interface CreatePage {
  slug: string;
  content: string;
  entityId?: number;
  entityType?: string;
}

export type DynamicPageData = Page & {
  character?: OnePieceCharacter;
  devilFruit?: DevilFruit;
  arc?: Arc;
  organisation?: Organisation 
};