import db from "@/lib/db";
import type { CreateOrganisationDto, UpdateOrganisationDto, PatchOrganisationDto } from "@/dtos/organisation.dto";
import cloudinary from "@/lib/cloudinary";
import { slugify } from "@/utils/slugify";

export const getAllOrganisation = async (search?: string) => {
  return db.organisation.findMany({
    include: {
      image: true,
      onePieceCharacter: true,
      crew: true,
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

export const getOrganisationById = async (id: number) => {
  const organisation = await db.organisation.findUnique({
    where: { id },
    include: {
      image: true,
      onePieceCharacter: true,
      crew: true,
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
  if (!organisation) return null;
  return organisation;
};
export const getOrganisationBySlug = async (slug: string) => {
  const organisation = await db.organisation.findUnique({
    where: { slug },
    include: {
      image: true,
      onePieceCharacter: true,
      crew: true,
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
  if (!organisation) return null;
  return organisation;
};

export const createOrganisation = async (data: CreateOrganisationDto) => {
  return db.organisation.create({
    data: {
      name: data.name,
      content: data.content,
      ...(data.imageId ? { image: { connect: { id: data.imageId } } } : {}),
      slug: slugify(data.name)
    },
  });
};

export const updateOrganisation = async (id: number, data: UpdateOrganisationDto) => {
  const existing = await db.arcs.findUnique({ where: { id } });
  if (!existing) return null;

  return db.organisation.update({
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

export const PatchOrganisation = async (id: number, data: PatchOrganisationDto) => {
  const existing = await db.arcs.findUnique({ where: { id } });
  if (!existing) return null;

  return db.organisation.update({
    where: { id },
    data: {
      name: data.name,
      image: {
        connect: { id: data.imageId! },
      },
    },
  });
};

export const deleteOrganisation = async (id: number) => {
  const existing = await db.organisation.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!existing) return null;

  if (existing?.image[0]?.publicId) {
    await cloudinary.uploader.destroy(existing.image[0].publicId);
    await db.image.delete({ where: { id: existing.image[0].id! } });
  }

  await db.organisation.delete({ where: { id } });
  return true;
};
