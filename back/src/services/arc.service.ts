import db from "@/lib/db";
import type { CreateArcrDto, UpdateArcDto, PatchArcDto } from "@/dtos/arc.dto";
import cloudinary from "@/lib/cloudinary";
import { slugify } from "@/utils/slugify";

export const getAllArc = async (search?: string) => {
  return db.arcs.findMany({
    include: {
      image: true,
      onePieceCharacter: true,
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

export const getArcById = async (id: number) => {
  const arc = await db.arcs.findUnique({
    where: { id },
    include: {
      image: true,
      onePieceCharacter: true,
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
  if (!arc) return null;
  return arc;
};
export const getArcBySlug = async (slug: string) => {
  const arc = await db.arcs.findUnique({
    where: { slug },
    include: {
      image: true,
      onePieceCharacter: true,
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
  if (!arc) return null;
  return arc;
};

export const createArc = async (data: CreateArcrDto) => {
  return db.arcs.create({
    data: {
      name: data.name,
      content: data.content,
      slug: slugify(data.name),
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
    },
  });
};

export const updateArc = async (id: number, data: UpdateArcDto) => {
  const existing = await db.arcs.findUnique({ where: { id } });
  if (!existing) return null;

  return db.arcs.update({
    where: { id },
    data: {
      name: data.name,
      content: data.content,
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
    },
  });
};

export const PatchArc = async (id: number, data: PatchArcDto) => {
  const existing = await db.arcs.findUnique({ where: { id } });
  if (!existing) return null;

  return db.arcs.update({
    where: { id },
    data: {
      name: data.name,
      content: data.content,
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
    },
  });
};

export const deleteArc = async (id: number) => {
  const existing = await db.arcs.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!existing) return null;

  if (existing?.image[0]?.publicId) {
    await cloudinary.uploader.destroy(existing.image[0].publicId);
    await db.image.delete({ where: { id: existing.image[0].id! } });
  }

  await db.arcs.delete({ where: { id } });
  return true;
};
