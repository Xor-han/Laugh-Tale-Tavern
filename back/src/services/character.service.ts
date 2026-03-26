import db from "@/lib/db";
import type {
  CreateCharacterDto,
  UpdateCharacterDto,
  PatchCharacterDto,
} from "@/dtos/character.dto";
import { Profession } from "@prisma/client";

export const getAllCharacter = async (search?: string) => {
  return (
    db.onePieceCharacter.findMany({
      include: {
        image: true,
        devilFruit: { select: { name: true } },
        organisation: { select: { name: true } },
        equipage: { select: { name: true } },
        arcs: { select: { name: true } },
      },
    }),
    db.page.findMany({
      where: {
        entityType: "CHARACTER",
        ...(search ? { content: { contains: search } } : {}),
      },
      select: { entityId: true },
    })
  );
};

export const getCharacterById = async (id: number) => {
  const character = await db.onePieceCharacter.findUnique({
    where: { id },
    include: {
      image: true,
      devilFruit: { select: { name: true } },
      organisation: { select: { name: true } },
      equipage: { select: { name: true } },
      arcs: { select: { name: true } },
    },
  });
  if (!character) return null;
  return character
};

export const createCharacter = async(data: CreateCharacterDto) => {
    return db.onePieceCharacter.create({
        data: {
            name: data.name,
            isAlive: data.isAlive ?? false,
            profession: data.profession as Profession,
            image: {
                connect:
                {id : data.imageId!}
            }
        }
    })
}