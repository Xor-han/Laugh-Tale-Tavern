export interface Arc {
  id: number;
  name: string;
  image: string;
}

export interface CreateArc {
  name: string;
  image: string;
}

export interface ArcUpdate {
  name?: string;
  image?: string;
}