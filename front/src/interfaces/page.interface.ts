import type { Comment } from "./comment.interface";

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