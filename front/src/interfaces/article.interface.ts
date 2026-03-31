export interface Article {
  id: number;
  name: string;
  slug: string;
  content: string;
  type: "characters" | "devilFruits" | "arcs" | "crews" | "organisations";
  image?: {
    url: string;
  }[];
}
