import db from "@/lib/db";
import type { CreateCrewDto, UpdateCrewDto, PatchCrewDto } from "@/dtos/crew.dto";
import cloudinary from "@/lib/cloudinary";
import { slugify } from "@/utils/slugify";

export const getAllCrew = async (search?: string) => {
  return db.crews.findMany({
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

export const getCrewById = async (slug: string) => {
  const crew = await db.crews.findUnique({
    where: { slug },
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
  return db.crews.create({
    data: {
      name: data.name,
      content: data.content,
      image: {
        connect: { id: data.imageId! },
      },
      slug: slugify(data.name),
    },
  });
};

export const updateCrew = async (id: number, data: UpdateCrewDto) => {
  const existing = await db.crews.findUnique({ where: { id } });
  if (!existing) return null;

  return db.crews.update({
    where: { id },
    data: {
      name: data.name,
      content: data.content,
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
    },
  });
};

export const PatchCrew = async (id: number, data: PatchCrewDto) => {
  const existing = await db.crews.findUnique({ where: { id } });
  if (!existing) return null;

  return db.crews.update({
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
  const existing = await db.crews.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!existing) return null;

  if (existing?.image[0]?.publicId) {
    await cloudinary.uploader.destroy(existing.image[0].publicId);
    await db.image.delete({ where: { id: existing.image[0].id! } });
  }

  await db.crews.delete({ where: { id } });
  return true;
};
