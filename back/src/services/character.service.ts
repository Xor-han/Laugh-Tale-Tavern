import db from "@/lib/db";
import type {
  CreateCharacterDto,
  UpdateCharacterDto,
  PatchCharacterDto,
} from "@/dtos/character.dto";
import { Profession } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

export const getAllCharacter = async (search?: string) => {
  return db.onePieceCharacter.findMany({
    include: {
      image: true,
      devilFruit: { select: { name: true } },
      organisation: { select: { name: true } },
      equipage: { select: { name: true } },
      arcs: { select: { name: true } },
    },
  });
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
      comment: {
        where: { parentId: null },
        include: {
          author: true,
          replies: {
            include: { author: true },
          },
        },
      },
    },
  });
  if (!character) return null;
  return character;
};

export const createCharacter = async (data: CreateCharacterDto) => {
  return db.onePieceCharacter.create({
    data: {
      name: data.name,
      content: data.content,
      isAlive: data.isAlive ?? false,
      profession: data.profession as Profession,
      image: {
        connect: { id: data.imageId! },
      },
      arcs: {
        connect: Array(Number(data.arcIds)).map((id: number) => ({ id })),
      },
      devilFruit_id: data.devilFruit_id,
      organisationId: data.organisationId,
      equipageId: data.equipageId,
    },
  });
};

export const updateCharacter = async (id: number, data: UpdateCharacterDto) => {
  const existing = await db.onePieceCharacter.findUnique({ where: { id } });
  if (!existing) return null;

  return db.onePieceCharacter.update({
    where: { id },
    data: {
      name: data.name,
      content: data.content,
      image: {
        connect: { id: data.imageId! },
      },
      isAlive: data.isAlive ?? false,
      profession: data.profession as Profession,
      arcs: {
        connect: Array(Number(data.arcIds)).map((id: number) => ({ id })),
      },
      devilFruit_id: data.devilFruit_id,
      organisationId: data.organisationId,
      equipageId: data.equipageId,
    },
  });
};

export const patchCharacter = async (id: number, data: PatchCharacterDto) => {
  const existing = await db.onePieceCharacter.findUnique({ where: { id } });
  if (!existing) return null;

  return db.onePieceCharacter.update({
    where: { id },
    data: {
      name: data.name,
      image: {
        connect: { id: data.imageId! },
      },
      isAlive: data.isAlive ?? false,
      profession: data.profession as Profession,
      arcs: {
        connect: Array(Number(data.arcIds)).map((id: number) => ({ id })),
      },
      devilFruit_id: data.devilFruit_id,
      organisationId: data.organisationId,
      equipageId: data.equipageId,
    },
  });
};

export const deleteCharacter = async (id: number) => {
  const existing = await db.onePieceCharacter.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!existing) return null;

  if (existing?.image[0]?.publicId) {
    await cloudinary.uploader.destroy(existing.image[0].publicId);
    await db.image.delete({ where: { id: existing.image[0].id! } });
  }

  await db.onePieceCharacter.delete({ where: { id } });
  return true;
};
