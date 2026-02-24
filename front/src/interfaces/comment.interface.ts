import type { User } from "./user.interface";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  pageId: number;
  parentId?: string | null;
  updatedAt: string;
  author: User;
  replies?: Comment[];
}

export interface CreateComment {
  content: string;
  pageId: number;
  parentId?: string | null; 
}

export interface CommentUpdate {
  content?: string;
}