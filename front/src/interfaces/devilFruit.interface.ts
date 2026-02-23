import type { Type } from "./type.interface";
export interface DevilFruit {
  id: number;
  name: string;
  Image: string;
  typeId: number;
  type?: Type; // Optionnel selon si tu fais un include
}