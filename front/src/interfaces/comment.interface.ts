import type { User } from "./user.interface";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  parentId?: string;
  updatedAt: string;
  author: User;
  replies?: Comment[];
}

export interface CreateComment {
  content: string;
  parentId?: string;
  onePieceCharacterId?: number;
  devilFruitId?: number;
  arcId?: number;
  organisationId?: number;
  crewId?: number;
}

export interface CommentUpdate {
  content?: string;
}