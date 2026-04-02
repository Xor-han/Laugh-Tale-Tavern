import db from "@/lib/db";
import type {
  CreateCharacterDto,
  UpdateCharacterDto,
  PatchCharacterDto,
} from "@/dtos/character.dto";
import { Profession } from "@prisma/client";

import cloudinary from "@/lib/cloudinary";
import { slugify } from "@/utils/slugify";

export const getAllCharacter = async (search?: string) => {
  return db.onePieceCharacter.findMany({
    include: {
      image: true,
      devilFruit: { select: { name: true } },
      organisation: { select: { name: true } },
      crew: { select: { name: true } },
      arcs: { select: { name: true } },
    },
  });
};

export const getCharacterById = async (id: number) => {
  const character = await db.onePieceCharacter.findUnique({
    where: { id },
    include: {
      image: true,
      devilFruit: { select: { id: true, name: true } },
      organisation: { select: { name: true } },
      crew: { select: { name: true } },
      arcs: { select: { id: true, name: true } }
}});
  if (!character) return null;
  return character;
};

export const getCharacterBySlug = async (slug: string) => {
  const character = await db.onePieceCharacter.findUnique({
    where: { slug },
    include: {
      image: true,
      devilFruit: { select: {id: true, name: true } },
      organisation: { select: { name: true } },
      crew: { select: { name: true } },
      arcs: { select: {id: true, name: true } },
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
      slug: slugify(data.name),
      isAlive: data.isAlive ?? false,
      profession: data.profession,
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
      arcs: {
        connect: data.arcIds?.map((id: number) => ({ id })),
      },
      devilFruitId: data.devilFruitId,
      organisationId: data.organisationId,
      crewId: data.crewId,
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
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
      isAlive: data.isAlive ?? false,
      profession: data.profession as Profession,
      arcs: {
        set: data.arcIds?.map((id: number) => ({ id })),
      },
      devilFruitId: data.devilFruitId,
      organisationId: data.organisationId,
      crewId: data.crewId,
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
      content: data.content,
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
      isAlive: data.isAlive ?? false,
      profession: data.profession as Profession,
      arcs: {
        set: data.arcIds?.map((id: number) => ({ id })),
      },
      devilFruitId: data.devilFruitId,
      organisationId: data.organisationId,
      crewId: data.crewId,
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
