export interface Page {
  id: number;
  slug: string;
  content: string;
  comments?: Comment[];
}