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
}

export interface CommentUpdate {
  content?: string;
}