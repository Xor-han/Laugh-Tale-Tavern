import db from "@/lib/db";
import type { CreateTypeDto, UpdateTypeDto } from "@/dtos/type.dto";
import cloudinary from "@/lib/cloudinary";

export const getAllType = async (search?: string) => {
  return db.type.findMany({
    include: {
      devilFruit: true,
    },
  });
};

export const getTypeById = async (id: number) => {
  const arc = await db.type.findUnique({
    where: { id },
    include: {
      devilFruit: true,
    },
  });
  if (!arc) return null;
  return arc;
};

export const createType = async (data: CreateTypeDto) => {
  return db.type.create({
    data: {
      name: data.name
    },
  });
};

export const updateType = async (id: number, data: UpdateTypeDto) => {
  const existing = await db.type.findUnique({ where: { id } });
  if (!existing) return null;

  return db.type.update({
    where: { id },
    data: {
      name: data.name
    },
  });
};

export const deleteType = async (id: number) => {
  const existing = await db.type.findUnique({
    where: { id }
  });
  if (!existing) return null;
  await db.type.delete({ where: { id } });
  return true;
};
