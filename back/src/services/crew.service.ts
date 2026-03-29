import db from "@/lib/db";
import type { CreateCrewDto, UpdateCrewDto, PatchCrewDto } from "@/dtos/crew.dto";
import cloudinary from "@/lib/cloudinary";

export const getAllCrew = async (search?: string) => {
  return db.equipages.findMany({
    include: {
      image: true,
      onePieceCharacter: true,
      organisation: true,
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

export const getCrewById = async (id: number) => {
  const crew = await db.equipages.findUnique({
    where: { id },
    include: {
      image: true,
      onePieceCharacter: true,
      organisation: true,
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
  if (!crew) return null;
  return crew;
};

export const createCrew = async (data: CreateCrewDto) => {
  return db.equipages.create({
    data: {
      name: data.name,
      content: data.content,
      image: {
        connect: { id: data.imageId! },
      },
    },
  });
};

export const updateCrew = async (id: number, data: UpdateCrewDto) => {
  const existing = await db.equipages.findUnique({ where: { id } });
  if (!existing) return null;

  return db.equipages.update({
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

export const PatchCrew = async (id: number, data: PatchCrewDto) => {
  const existing = await db.equipages.findUnique({ where: { id } });
  if (!existing) return null;

  return db.equipages.update({
    where: { id },
    data: {
      name: data.name,
      image: {
        connect: { id: data.imageId! },
      },
    },
  });
};

export const deleteCrew = async (id: number) => {
  const existing = await db.equipages.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!existing) return null;

  if (existing?.image[0]?.publicId) {
    await cloudinary.uploader.destroy(existing.image[0].publicId);
    await db.image.delete({ where: { id: existing.image[0].id! } });
  }

  await db.equipages.delete({ where: { id } });
  return true;
};
