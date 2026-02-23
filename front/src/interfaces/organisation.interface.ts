import type { Equipage } from "./equipage.interface";


export interface Organisation {
  id: number;
  name: string;
  equipageId?: number | null;
  equipage?: Equipage | null;
}