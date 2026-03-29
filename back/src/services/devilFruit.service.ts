import db from "@/lib/db";
import type { CreateDevilFruitDto, UpdateDevilFruitDto, PatchDevilFruitDto } from "@/dtos/devilFruit.dto";
import cloudinary from "@/lib/cloudinary";

export const getAllDevilFruit = async (search?: string) => {
  return db.devilFruit.findMany({
    include: {
      image: true,
      onePieceCharacters: true,
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
};

export const getDevilFruitById = async (id: number) => {
  const devilFruit = await db.devilFruit.findUnique({
    where: { id },
    include: {
      image: true,
      onePieceCharacters: true,
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
  if (!devilFruit) return null;
  return devilFruit;
};

export const createDevilFruit = async (data: CreateDevilFruitDto) => {
  return db.devilFruit.create({
    data: {
      name: data.name,
      content: data.content,
      image: {
        connect: { id: data.imageId! },
      },
    },
  });
};

export const updateDevilFruit = async (id: number, data: UpdateDevilFruitDto) => {
  const existing = await db.devilFruit.findUnique({ where: { id } });
  if (!existing) return null;

  return db.devilFruit.update({
    where: { id },
    data: {
      name: data.name,
      content: data.content,
      image: {
        connect: { id: data.imageId! },
      },
    },
  });
};

export const PatchDevilFruit = async (id: number, data: PatchDevilFruitDto) => {
  const existing = await db.devilFruit.findUnique({ where: { id } });
  if (!existing) return null;

  return db.devilFruit.update({
    where: { id },
    data: {
      name: data.name,
      image: {
        connect: { id: data.imageId! },
      },
    },
  });
};

export const deleteDevilFruit = async (id: number) => {
  const existing = await db.devilFruit.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!existing) return null;

  if (existing?.image[0]?.publicId) {
    await cloudinary.uploader.destroy(existing.image[0].publicId);
    await db.image.delete({ where: { id: existing.image[0].id! } });
  }

  await db.devilFruit.delete({ where: { id } });
  return true;
};
