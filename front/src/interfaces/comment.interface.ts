import type { User } from "./user.interface";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorId: string;
  pageId: number;
  parentId?: number | null;
  author: User;
  replies?: Comment[];
}