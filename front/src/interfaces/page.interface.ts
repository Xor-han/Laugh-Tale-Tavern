import type { Comment } from "./comment.interface";

export interface Page {
  id: number;
  slug: string;
  content: string;
  comments?: Comment[];
}

export interface PageUpdate {
  slug?: string;
  content?: string;
}

export interface CreatePage {
  slug: string;
  content: string;
}