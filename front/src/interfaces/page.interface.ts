import type { Comment } from "./comment.interface";

export interface Page {
  id: number;
  slug: string;
  content: string;
  comments?: Comment[];
}