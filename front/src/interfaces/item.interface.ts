export interface BaseItem {
  id: number;
  name: string;   
  slug?: string;   
  content: string; 
  image?: {        
    url: string;
  }[];
}