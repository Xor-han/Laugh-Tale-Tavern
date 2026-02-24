export interface Equipage {
  id: number;
  name: string;
}

export interface CreateEquipage {
  name: string;
}

export interface EquipageUpdate {
  name?: string;
}