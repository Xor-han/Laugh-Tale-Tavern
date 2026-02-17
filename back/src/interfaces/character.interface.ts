import { Faction } from "@prisma/client";

export interface Character {
    id : number,
    name : string,
    profession : string,
    faction : Faction[],
};